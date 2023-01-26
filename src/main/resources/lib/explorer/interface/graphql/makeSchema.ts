//import {toStr} from '@enonic/js-utils';
import {
	GraphQLBoolean,
	GraphQLInt,
	GraphQLString,
	newSchemaGenerator,
	list,
	nonNull,
	//@ts-ignore
} from '/lib/graphql';


import {constructGlue} from './utils/Glue';

// Input
import {addAggregationInput} from '/lib/explorer/interface/graphql/aggregations/guillotine/input/addAggregationInput';
import {addFilterInput} from '/lib/explorer/interface/graphql/filters/guillotine/input/addFilterInput';
import {addInputTypeHighlight} from '/lib/explorer/interface/graphql/highlight/input/addInputTypeHighlight';
// import {addQueryDSL} from '/lib/explorer/interface/graphql/queryDSL/addQueryDSL';
//import {addInputTypeSynonyms} from '/lib/explorer/interface/graphql/input/addInputTypeSynonyms';

// Output
import {searchConnectionResolver} from '/lib/explorer/interface/graphql/output/searchConnectionResolver';
import {searchResolver} from '/lib/explorer/interface/graphql/output/searchResolver';
import {addDocumentTypeObjectTypes} from '/lib/explorer/interface/graphql/output/addDocumentTypeObjectTypes';
import {addObjectTypeSearchConnection} from '/lib/explorer/interface/graphql/output/addObjectTypeSearchConnection';
import {addObjectTypeSearchResult} from '/lib/explorer/interface/graphql/output/addObjectTypeSearchResult';
import {addObjectTypeQuerySynonymsResult} from '/lib/explorer/interface/graphql/output/addObjectTypeQuerySynonymsResult';
import {querySynonymsResolver} from '/lib/explorer/interface/graphql/output/querySynonymsResolver';


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
		// query: addQueryDSL({glue}),
		searchString: GraphQLString // Can't be nonNull when used as subQuery
	}

	glue.addQueryField({
		name: 'interface',
		args: {},
		resolve() {
			return {};
		},
		type: glue.addObjectType({
			name: 'interfaceResults',
			fields: {
				getSearchConnection: {
					args: {
						...commonGQLInputFields,
						after: GraphQLString,
						first: GraphQLInt,
					},
					resolve: searchConnectionResolver,
					type: addObjectTypeSearchConnection({glue}),
				},
				querySynonyms: {
					args: {
						// Required
						searchString: nonNull(GraphQLString), // "" satisfies nonNull :)
						// Optional
						languages: list(GraphQLString),
						profiling: GraphQLBoolean
					},
					resolve: querySynonymsResolver,
					type: addObjectTypeQuerySynonymsResult({glue})
				},
				search: {
					args: { // GraphQL input types
						...commonGQLInputFields,
						count: GraphQLInt,
						start: GraphQLInt
					},
					resolve: searchResolver,
					type: addObjectTypeSearchResult({glue})
				}
			}
		})
	});

	return glue.buildSchema();
} // makeSchema
