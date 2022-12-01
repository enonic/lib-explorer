import type {
	SearchConnectionResolverEnv,
	SearchResolverEnv,
	SearchResolverReturnType
} from '/lib/explorer/interface/graphql/output/index.d';


//import {toStr} from '@enonic/js-utils';
import {
	GraphQLBoolean,
	GraphQLInt,
	GraphQLString,
	newSchemaGenerator,
	list
	//@ts-ignore
} from '/lib/graphql';
import {
	decodeCursor//,
	//encodeCursor // Just use to generate after for testing
	//@ts-ignore
} from '/lib/graphql-connection';

import {constructGlue} from './utils/Glue';

// Input
import {addAggregationInput} from '/lib/explorer/interface/graphql/aggregations/guillotine/input/addAggregationInput';
import {addFilterInput} from '/lib/explorer/interface/graphql/filters/guillotine/input/addFilterInput';
import {addInputTypeHighlight} from '/lib/explorer/interface/graphql/highlight/input/addInputTypeHighlight';
import {addQueryDSL} from '/lib/explorer/interface/graphql/queryDSL/addQueryDSL';
//import {addInputTypeSynonyms} from '/lib/explorer/interface/graphql/input/addInputTypeSynonyms';

// Output
import {searchResolver} from '/lib/explorer/interface/graphql/output/searchResolver';
import {addDocumentTypeObjectTypes} from '/lib/explorer/interface/graphql/output/addDocumentTypeObjectTypes';
import {addObjectTypeSearchConnection} from '/lib/explorer/interface/graphql/output/addObjectTypeSearchConnection';
import {addObjectTypeSearchResult} from '/lib/explorer/interface/graphql/output/addObjectTypeSearchResult';

import {addQueryFieldQuerySynonyms} from '/lib/explorer/interface/graphql/queries/addQueryFieldQuerySynonyms';


export function makeSchema() {
	const schemaGenerator = newSchemaGenerator();
	const glue = constructGlue({schemaGenerator});

	const documentTypeObjectTypes = {}; // Defined before addDynamicInterfaceTypes, populated after
	const camelToFieldObj :Record<string,string> = {};
	addDocumentTypeObjectTypes({ // Does addDynamicInterfaceTypes for us :)
		camelToFieldObj, // modified within
		documentTypeObjectTypes, // modified within
		glue
	});
	//log.debug('makeSchema camelToFieldObj:%s', toStr(camelToFieldObj));

	/*const fieldsEnumType = glue.addEnumType({
		name: 'Fields',
		values: {
			_collection: `${FIELD_PATH_META}.collection`,
			_createdTime: `${FIELD_PATH_META}.createdTime`,
			_documentType: `${FIELD_PATH_META}.documentType`,
			_modifiedTime: `${FIELD_PATH_META}.modifiedTime`,
			...camelToFieldObj, // Must be populated first!
		}
	});

	const highlightFieldsEnumType = glue.addEnumType({
		name: 'HighlightFields',
		values: {
			_alltext: '_alltext',
			...camelToFieldObj // Must be populated first!
		}
	});*/

	const commonGQLInputFields = {
		aggregations: list(addAggregationInput({
			//fieldType: fieldsEnumType,
			glue
		})),
		filters: list(addFilterInput({
			//fieldType: fieldsEnumType,
			glue
		})),
		highlight: addInputTypeHighlight({
			//fieldType: highlightFieldsEnumType,
			glue
		}),
		languages: list(GraphQLString),
		profiling: GraphQLBoolean,
		query: addQueryDSL({glue}),
		searchString: GraphQLString // Can't be nonNull when used as subQuery
	}

	glue.addQueryField<SearchConnectionResolverEnv, SearchResolverReturnType>({
		args: {
			...commonGQLInputFields,
			after: GraphQLString,
			first: GraphQLInt,
		},
		name: 'getSearchConnection',
		resolve(env) {
			//log.debug(`env:${toStr({env})}`);
			const {
				after,// = encodeCursor('0'), // encoded representation of start
				aggregations,
				filters,
				first = 10, // count
				highlight,
				languages,
				profiling,
				searchString//,
				//synonyms
			} = env.args;
			//log.debug('after:%s', toStr(after));
			//log.debug('first:%s', toStr(first));
			//log.debug("encodeCursor('0'):%s", toStr(encodeCursor('0'))); // MA==
			//log.debug("encodeCursor('1'):%s", toStr(encodeCursor('1'))); // MQ==
			//log.debug("encodeCursor('2'):%s", toStr(encodeCursor('2'))); // Mg==

			const start = after ? parseInt(decodeCursor(after)) + 1 : 0;
			//log.debug('start:%s', toStr(start));

			const res = searchResolver({
				args: {
					aggregations,
					count: first,
					filters,
					highlight,
					languages,
					profiling,
					searchString,
					start//,
					//synonyms
				},
				context: env.context,
				source: env.source
			});
			return res;
		},
		type: addObjectTypeSearchConnection({glue})
	});

	glue.addQueryField<SearchResolverEnv, SearchResolverReturnType>({
		args: { // GraphQL input types
			...commonGQLInputFields,
			count: GraphQLInt,
			start: GraphQLInt
		},
		name: 'search',
		resolve: (env) => searchResolver(env),
		type: addObjectTypeSearchResult({glue})
	}); // addQueryField search

	addQueryFieldQuerySynonyms({glue});

	return glue.buildSchema();
} // makeSchema
