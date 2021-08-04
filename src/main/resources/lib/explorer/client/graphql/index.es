import {toStr} from '@enonic/js-utils';

//import {gqlToObj} from '/lib/explorer/client/graphql/gqlToObj';

import {buildCollectionsArg} from '/lib/explorer/client/graphql/collection';
import {
	buildHighlightArg,
	buildHighlights,
	buildHitFields,
	buildMustExistFieldsArg,
	buildQueryArg
} from '/lib/explorer/client/graphql/field';
import {buildStopwordsArg} from '/lib/explorer/client/graphql/stopword';
import {wash} from '/lib/explorer/query/wash';
import {decamelize} from '/lib/explorer/string/decamelize';
import {
	execute,
	GraphQLInt,
	GraphQLString,
	list,
	newSchemaGenerator,
	nonNull
} from '/lib/graphql';

const {
	createEnumType,
	createObjectType,
	createSchema
} = newSchemaGenerator();


const ELLIPSIS = '…';

const ENCODER_DEFALT = 'default';
const FRAGMENTER_DEFAULT = 'span';

const FRAGMENT_SIZE_DEFAULT = 100;
//const FRAGMENT_SIZE_DEFAULT = 255;

const NO_MATCH_SIZE = 0;

//const NUMBER_OF_FRAGMENTS_DEFAULT = 1;
const NUMBER_OF_FRAGMENTS_DEFAULT = 5;

const ORDER_DEFAULT = 'none';

const POST_TAG_DEFAULT = '</em>';
const PRE_TAG_DEFAULT = '<em>';
//const POST_TAG_DEFAULT = '</b>';
//const PRE_TAG_DEFAULT = '<b>';

const REQUIRED_FIELD_MATCH_DEFAULT = true;
const TAGS_SCHEMA_DEFAULT = 'styled';

function buildSchema(/**{
	//query,
	//variables
} = {}*/) {
	const context = {
		types: {},
		dictionary: [],
		nameCountMap: {},
		/*contentTypeMap: {},
		options: {},
		addDictionaryType: function (objectType) {
			this.dictionary.push(objectType);
		},
		putContentTypeType: function (name, objectType) {
			this.contentTypeMap[name] = objectType;
		},*/
		uniqueName: function (name) {
			var uniqueName = name;
			if (this.nameCountMap[name]) {
				this.nameCountMap[uniqueName]++;
				uniqueName = name + '_' + this.nameCountMap[uniqueName];
			} else {
				this.nameCountMap[uniqueName] = 1;
			}
			return uniqueName;
		}/*,
		getOption: function (name) {
			return this.options[name];
		},
		putOption: function (name, value) {
			this.options[name] = value;
		}*/
	};
	log.info(`context:${toStr(context)}`);
	context.types.collectionType = createEnumType({
		name: context.uniqueName('CollectionType'),
		description: 'Collection type.',
		values: {
			'server': 'server',
			'absolute': 'absolute'
		}
	});
	log.info(`context:${toStr(context)}`);
	return createSchema({
		dictionary: context.dictionary,
		query: createObjectType({ name: 'Query', fields: { search: {
			args: {
				a: list(context.types.collectionType),
				collections: buildCollectionsArg(),
				mustExistFields: buildMustExistFieldsArg(),
				query: buildQueryArg(),
				stopwords: buildStopwordsArg(),
				searchString: GraphQLString,
				highlight: buildHighlightArg()
			}, // args
			resolve: (env) => {
				log.info(`env:${toStr(env)}`);
				//log.info(`query:${toStr(query)}`);
				//log.info(`variables:${toStr(variables)}`);
				const {
					collections: collectionsObj = {},
					mustExistFields: mustExistFieldsObj = {},
					query: queryObj = {},
					stopwords: stopwordsObj = {},
					searchString = '',
					highlight: highlightObj // undefined allowed and handeled below
				} = env.args || {};
				const washedSearchString = wash({string: searchString});
				const queryStr = Object.keys(queryObj).map((fn) =>
					`${fn}('${Object.keys(queryObj[fn].fields).map((field) =>
						`${field}^${queryObj[fn].fields[field]}`)}','${washedSearchString}','${queryObj[fn].operator||'AND'}')`
				).join(' OR ');
				const highlights = {
				};
				if (highlightObj) {
					if(highlightObj.encoder !== ENCODER_DEFALT) {
						highlights.encoder = highlightObj.encoder;
					}
					if(highlightObj.fragmenter !== FRAGMENTER_DEFAULT) {
						highlights.fragmenter = highlightObj.fragmenter;
					}
					if(highlightObj.fragmentSize !== FRAGMENT_SIZE_DEFAULT) {
						highlights.fragmentSize = highlightObj.fragmentSize;
					}
					if(highlightObj.noMatchSize !== NO_MATCH_SIZE) {
						highlights.noMatchSize = highlightObj.noMatchSize;
					}
					if(highlightObj.numberOfFragments !== NUMBER_OF_FRAGMENTS_DEFAULT) {
						highlights.numberOfFragments = highlightObj.numberOfFragments;
					}
					if(highlightObj.order !== ORDER_DEFAULT) {
						highlights.order = highlightObj.order;
					}
					if(highlightObj.postTag !== POST_TAG_DEFAULT) {
						highlights.postTag = highlightObj.postTag;
					}
					if(highlightObj.preTag !== PRE_TAG_DEFAULT) {
						highlights.preTag = highlightObj.preTag;
					}
					if(highlightObj.requireFieldMatch !== REQUIRED_FIELD_MATCH_DEFAULT) {
						highlights.requireFieldMatch = highlightObj.requireFieldMatch;
					}
					if(highlightObj.tagsSchema !== TAGS_SCHEMA_DEFAULT) {
						highlights.tagsSchema = highlightObj.tagsSchema;
					}
					if (highlightObj.properties) {
						highlights.properties = {};
						Object.keys(highlightObj.properties).forEach((field) => {
							highlights.properties[field] = {};
							if(highlightObj.properties[field].fragmenter !== highlights.fragmenter) {
								highlights.properties[field].fragmenter = highlightObj.properties[field].fragmenter;
							}
							if(highlightObj.properties[field].fragmentSize !== highlights.fragmentSize) {
								highlights.properties[field].fragmentSize = highlightObj.properties[field].fragmentSize;
							}
							if(highlightObj.properties[field].noMatchSize !== highlights.noMatchSize) {
								highlights.properties[field].noMatchSize = highlightObj.properties[field].noMatchSize;
							}
							if(highlightObj.properties[field].numberOfFragments !== highlights.numberOfFragments) {
								highlights.properties[field].numberOfFragments = highlightObj.properties[field].numberOfFragments;
							}
							if(highlightObj.properties[field].order !== highlights.order) {
								highlights.properties[field].order = highlightObj.properties[field].order;
							}
							if(highlightObj.properties[field].postTag !== highlights.postTag) {
								highlights.properties[field].postTag = highlightObj.properties[field].postTag;
							}
							if(highlightObj.properties[field].preTag !== highlights.preTag) {
								highlights.properties[field].preTag = highlightObj.properties[field].preTag;
							}
							if(highlightObj.properties[field].requireFieldMatch !== highlights.requireFieldMatch) {
								highlights.properties[field].requireFieldMatch = highlightObj.properties[field].requireFieldMatch;
							}
						}); // forEach field
					} // if highlightObj.properties
				} // if highlightObj
				//log.info(`highlights:${toStr(highlights)}`);
				return {
					count: 1,
					hits: [{
						title: 'Title',
						text: `${ELLIPSIS}bla bla <b>covid</b> bla bla${ELLIPSIS}`,
						uri: 'https://www.example.com'
					}],
					params: {
						collections: Object.keys(collectionsObj).map((collection) => decamelize(collection, '-')),
						mustExistFields: Object.keys(mustExistFieldsObj),
						query: queryStr,
						stopwords: Object.keys(stopwordsObj),
						searchString: washedSearchString,
						highlights
					},
					total: 2
				};
			}, // resolve
			type: createObjectType({ name: 'SearchResult', fields: {
				count: { type: nonNull(GraphQLInt) },
				hits: { type: list(createObjectType({
					name: 'SearchResultHitField',
					fields: buildHitFields()
				}))},
				params: { type: nonNull(createObjectType({ name: 'SearchResultParams', fields: {
					collections: { type: list(GraphQLString) },
					mustExistFields: { type: list(GraphQLString) },
					query: { type: GraphQLString },
					stopwords: { type: list(GraphQLString) },
					searchString: { type: GraphQLString },
					highlights: buildHighlights()
				}}))},
				total: { type: nonNull(GraphQLInt) }
			}}) // type
		}}})}); // search
} // function buildSchema


export const executeSchema = ({
	query,
	variables
}) => execute(buildSchema(/*{
	query: gqlToObj(query),
	variables
}*/), query, variables);
