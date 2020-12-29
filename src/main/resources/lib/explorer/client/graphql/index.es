import {buildCollectionsArg} from '/lib/explorer/client/graphqL/collection';
import {
	buildHitFields,
	buildMustExistFieldsArg,
	buildQueryArg
} from '/lib/explorer/client/graphqL/field';
import {buildStopwordsArg} from '/lib/explorer/client/graphqL/stopword';
import {wash} from '/lib/explorer/query/wash';
import {decamelize} from '/lib/explorer/string/decamelize';
import {
	//createInputObjectType,
	createObjectType,
	createSchema,
	//createUnionType,
	//execute,
	//GraphQLBoolean,
	//GraphQLFloat,
	GraphQLInt,
	GraphQLString,
	list,
	nonNull
} from '/lib/graphql';
import {toStr} from '/lib/util';


const ELLIPSIS = '…';


export function buildSchema(/*{} = {}*/) {
	return createSchema({ query: createObjectType({ name: 'Query', fields: { search: {
		args: {
			collections: buildCollectionsArg(),
			mustExistFields: buildMustExistFieldsArg(),
			query: buildQueryArg(),
			stopwords: buildStopwordsArg(),
			searchString: GraphQLString
		}, // args
		resolve: (env) => {
			log.info(`env:${toStr(env)}`);
			const {
				collections: collectionsObj = {},
				mustExistFields: mustExistFieldsObj = {},
				query: queryObj = {},
				stopwords: stopwordsObj = {},
				searchString = ''
			} = env.args || {};
			const washedSearchString = wash({string: searchString});
			const queryStr = Object.keys(queryObj).map((fn) =>
				`${fn}('${Object.keys(queryObj[fn].fields).map((field) =>
					`${field}^${queryObj[fn].fields[field]}`)}','${washedSearchString}','${queryObj[fn].operator||'AND'}')`
			).join(' OR ');
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
					searchString: washedSearchString
				},
				total: 2
			};
		}, // resolve
		type: createObjectType({ name: 'SearchResult', fields: {
			count: { type: nonNull(GraphQLInt) },
			hits: { type: list(createObjectType({
				name: 'SearchResultHit',
				fields: buildHitFields()
			}))},
			params: { type: nonNull(createObjectType({ name: 'SearchResultParams', fields: {
				collections: { type: list(GraphQLString) },
				mustExistFields: { type: list(GraphQLString) },
				query: { type: GraphQLString },
				stopwords: { type: list(GraphQLString) },
				searchString: { type: GraphQLString }
			}}))},
			total: { type: nonNull(GraphQLInt) }
		}}) // type
	}}})}); // search
} // function buildSchema
