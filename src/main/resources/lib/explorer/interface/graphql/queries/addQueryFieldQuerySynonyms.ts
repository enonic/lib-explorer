//import type {AnyObject} from '@enonic/js-utils/src/types';
//import {SynonymsArray} from '/lib/explorer/synonym/index.d';
import type {Glue} from '../utils/Glue';
import type {
	Profiling,
	QuerySynonymsResolverEnv,
	QuerySynonymsReturnType
} from '/lib/explorer/interface/graphql/output/index.d';


//import {toStr} from '@enonic/js-utils';
//import {parse as parseGraphqlFields} from 'parse-graphql';
//import parseGraphqlAst from 'graphql-parse-fields'; // Needs polyfill for process
import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/constants';
import {connect} from '/lib/explorer/repo/connect';
import {addObjectTypeSearchResultSynonym} from '/lib/explorer/interface/graphql/output/addObjectTypeSearchResultSynonym';
import {getInterfaceInfo} from '/lib/explorer/interface/graphql/output/getInterfaceInfo';
import {getSynonymsFromSearchString} from '/lib/explorer/synonym/getSynonymsFromSearchString';
import {currentTimeMillis} from '/lib/explorer/time/currentTimeMillis';
import {
	GraphQLBoolean,
	GraphQLInt,
	GraphQLString,
	list,
	nonNull
	//@ts-ignore
} from '/lib/graphql';

// Input
import {addAggregationInput} from '/lib/explorer/interface/graphql/aggregations/guillotine/input/addAggregationInput';
import {addFilterInput} from '/lib/explorer/interface/graphql/filters/guillotine/input/addFilterInput';
import {addInputTypeHighlight} from '/lib/explorer/interface/graphql/highlight/input/addInputTypeHighlight';
//import {addInputTypeSynonyms} from '/lib/explorer/interface/graphql/input/addInputTypeSynonyms';

// Output
import {searchResolver} from '/lib/explorer/interface/graphql/output/searchResolver';
import {addObjectTypeProfiling} from '/lib/explorer/interface/graphql/output/addObjectTypeProfiling';
import {addObjectTypeSearchResult} from '/lib/explorer/interface/graphql/output/addObjectTypeSearchResult';


export function addQueryFieldQuerySynonyms({glue} :{glue :Glue}) {
	glue.addQueryField<QuerySynonymsResolverEnv, QuerySynonymsReturnType>({
		args: {
			// Required
			searchString: nonNull(GraphQLString), // "" satisfies nonNull :)
			// Optional
			languages: list(GraphQLString),
			profiling: GraphQLBoolean
		},
		name: 'querySynonyms',
		resolve({
			args: {
				languages,
				profiling: profilingArg = false,
				searchString
			},
			context: {
				interfaceName,
				//logQuery = false,
				logSynonymsQuery = false,
				logSynonymsQueryResult = false//,
				//query: graphqlFieldsString
			}//,
			//source
		}) {
			let profiling :Array<Profiling> = [];
			if (profilingArg) {
				profiling.push({
					currentTimeMillis: currentTimeMillis(),
					label: 'querySynonyms',
					operation: 'start'
				});
				//log.debug('profiling:%s', toStr(profiling));
			}
			//log.debug('querySynonyms resolver source: %s', toStr(source)); // null

			//log.debug('querySynonyms resolver graphqlFieldsString: %s', toStr(graphqlFieldsString));
			/*const graphqlDocument = parseGraphqlFields(graphqlFieldsString);
			profiling.push({
				currentTimeMillis: currentTimeMillis(),
				label: 'parseGraphqlFields'
			});
			//log.debug('querySynonyms resolver graphqlDocument: %s', toStr(graphqlDocument));
			log.debug('querySynonyms resolver graphqlDocument.definitions: %s', toStr(graphqlDocument.definitions));

			const graphqlFieldsObject = parseGraphqlAst(graphqlDocument.definitions);
			profiling.push({
				currentTimeMillis: currentTimeMillis(),
				label: 'parseGraphqlAst'
			});
			log.debug('querySynonyms resolver graphqlFieldsObject: %s', toStr(graphqlFieldsObject));*/

			const interfaceInfo = getInterfaceInfo({
				interfaceName
			});

			const {
				//collectionNameToId,
				//fields,
				interfaceId,
				localesInSelectedThesauri,
				//stopWords,
				thesauriNames
			} = interfaceInfo;
			if (profilingArg) {
				profiling.push({
					currentTimeMillis: currentTimeMillis(),
					label: 'querySynonyms',
					operation: 'getInterfaceInfo'
				});
				//log.debug('profiling:%s', toStr(profiling));
			}
			// TODO reuse interface information?
			const rv :QuerySynonymsReturnType = {
				interfaceInfo,
				languages: languages ? languages : localesInSelectedThesauri,
				searchString,
				synonyms: getSynonymsFromSearchString({
					explorerRepoReadConnection: connect({ principals: [PRINCIPAL_EXPLORER_READ] }),
					defaultLocales: localesInSelectedThesauri,
					doProfiling: profilingArg,
					locales: languages,
					logQuery: logSynonymsQuery,
					logQueryResult: logSynonymsQueryResult,
					interfaceId,
					profilingArray: profiling, // Gets modified within
					profilingLabel: 'querySynonyms',
					searchString,
					showSynonyms: true, // TODO hardcode
					thesauri: thesauriNames
				})
			};
			if (profilingArg) {
				/*profiling.push({
					currentTimeMillis: currentTimeMillis(),
					label: 'querySynonyms: end'
				});*/
				rv.profiling = profiling;
			}
			return rv;
		}, // resolve
		type: glue.addObjectType({
			name: 'QuerySynonymsResult',
			fields: {
				languages: {
					type: list(GraphQLString)
				},
				profiling: {
					type: list(addObjectTypeProfiling({glue}))
				},
				search: {
					args: {
						aggregations: list(addAggregationInput({glue})),
						count: GraphQLInt,
						filters: list(addFilterInput({glue})),
						highlight: addInputTypeHighlight({glue}),
						start: GraphQLInt,
					},
					resolve: searchResolver,
					type: addObjectTypeSearchResult({glue})
				},
				/*searchString: {
					type: GraphQLString
				},*/
				synonyms: {
					type: list(addObjectTypeSearchResultSynonym({glue}))
				}
			}
		}) // type
	}); // addQueryField
}
