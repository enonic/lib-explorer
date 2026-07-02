import {
	GraphQLBoolean,
	GraphQLString,
	newSchemaGenerator,
	list,
	nonNull,
	// @ts-ignore No types yet.
} from '/lib/graphql';
import {Principal} from '@enonic/explorer-utils';
// import { toStr } from '@enonic/js-utils/value/toStr';
import { constructGlue } from './utils/Glue';

// Output
import { connect } from '/lib/explorer/repo/connect';
import { exists as interfaceExists } from '/lib/explorer/interface/exists';
import { getInterfaceInfo } from '/lib/explorer/interface/graphql/output/getInterfaceInfo';
import { searchConnectionResolver } from '/lib/explorer/interface/graphql/output/searchConnectionResolver';
import { searchResolver } from '/lib/explorer/interface/graphql/output/searchResolver';
import { addDocumentTypeObjectTypes } from '/lib/explorer/interface/graphql/output/addDocumentTypeObjectTypes';
import { addObjectTypeSearchConnection } from '/lib/explorer/interface/graphql/output/addObjectTypeSearchConnection';
import { addObjectTypeSearchResult } from '/lib/explorer/interface/graphql/output/addObjectTypeSearchResult';
import { addObjectTypeQuerySynonymsResult } from '/lib/explorer/interface/graphql/output/addObjectTypeQuerySynonymsResult';
import { querySynonymsResolver } from '/lib/explorer/interface/graphql/output/querySynonymsResolver';
import { getSearchArgs } from './output/getSearchArgs';
import { getSearchConnectionArgs } from './output/getSearchConnectionArgs';


export function makeSchema() {
	const schemaGenerator = newSchemaGenerator();
	const glue = constructGlue({schemaGenerator});

	const documentTypeObjectTypes = {}; // Defined before addDynamicInterfaceTypes, populated after
	const camelToFieldObj: Record<string,string> = {};
	addDocumentTypeObjectTypes({ // Does addDynamicInterfaceTypes for us :)
		camelToFieldObj, // modified within
		documentTypeObjectTypes, // modified within
		glue
	});
	// log.debug('makeSchema camelToFieldObj:%s', toStr(camelToFieldObj));

	glue.addQueryField<{
		args: {
			name?: string
		}
		context: {
			allowedInterfaces: Record<number,string>
			interfaceName?: string
		}
	}>({
		name: 'interface',
		args: {
			name: GraphQLString,
		},
		resolve(env) {
			// log.debug('env:%s', toStr(env));
			const {
				args,
				context
			} = env;
			const {
				allowedInterfaces,
				interfaceName: contextInterfaceName
			} = context;
			const {name: interfaceName = contextInterfaceName} = args;
			if (!interfaceName) {
				throw new Error('interface name not provided via request headers or args!');
			}
			const nums = Object.keys(allowedInterfaces);
			let found = false;
			for (let i = 0; i < nums.length; i++) {
				const num = nums[i];
				if (allowedInterfaces[num] === interfaceName) {
					found = true;
					break;
				}
			}
			if (!found) {
				throw new Error(`You don't have read access to interface:${interfaceName}!`);
			}
			const explorerRepoReadConnection = connect({ principals: [Principal.EXPLORER_READ] });
			if (!interfaceExists({
				connection: explorerRepoReadConnection,
				name: interfaceName
			})) {
				throw new Error(`interface:${interfaceName} doesn't exist!`);
			}
			const interfaceInfo = getInterfaceInfo({
				interfaceName
			});
			return {
				interfaceInfo,
			};
		},
		type: glue.addObjectType({
			name: 'interfaceResults',
			fields: {
				getSearchConnection: {
					args: getSearchConnectionArgs({ glue }),
					resolve: searchConnectionResolver,
					type: addObjectTypeSearchConnection({ glue }),
				},
				querySynonyms: {
					args: {
						// Required
						searchString: nonNull(GraphQLString), // "" satisfies nonNull :)
						// Optional
						languages: list(GraphQLString),
						profiling: GraphQLBoolean,
					},
					resolve: querySynonymsResolver,
					type: addObjectTypeQuerySynonymsResult({ glue })
				},
				search: {
					args: getSearchArgs({ glue }),
					resolve: searchResolver,
					type: addObjectTypeSearchResult({ glue })
				}
			}
		})
	});

	return glue.buildSchema();
} // makeSchema
