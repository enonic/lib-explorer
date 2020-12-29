import {newCache} from '/lib/cache';
import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {getFields} from '/lib/explorer/field/getFields';
import {camelize} from '/lib/explorer/string/camelize';
import {
	createInputObjectType,
	createObjectType,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLString
} from '/lib/graphql';
//import {toStr} from '/lib/util';


const fieldCache = newCache({
	size: 1,
	expire: 3600 // Expire time in number of seconds.
});


const getCachedFields = () => fieldCache.get('a', () => getFields({
	connection: connect({ principals: [PRINCIPAL_EXPLORER_READ] })
}).hits.map(({key}) => camelize(key, /-/g)));


export function buildHighlightArg() {
	const fieldsObj = {};
	getCachedFields().forEach((field) => {
		fieldsObj[field] = {type: createInputObjectType({name: `SearchHighlightArgProperties${field}`, fields: {
			fragmenter: { type: GraphQLString }, // span simple
			fragmentSize: { type: GraphQLInt },  // 100
			numberOfFragments: { type: GraphQLInt }, // 5
			noMatchSize: { type: GraphQLInt }, // 0
			order: { type: GraphQLString }, // none score
			preTag: { type: GraphQLString }, // <em>
			postTag: { type: GraphQLString }, // </em>
			requireFieldMatch: { type: GraphQLBoolean } // true false
		}})};
	});
	return createInputObjectType({ name: 'SearchHighlightArg', fields: {
		encoder: { type: GraphQLString }, // default html
		fragmenter: { type: GraphQLString }, // span simple
		fragmentSize: { type: GraphQLInt },  // 100
		noMatchSize: { type: GraphQLInt }, // 0
		numberOfFragments: { type: GraphQLInt }, // 5
		order: { type: GraphQLString }, // none score
		postTag: { type: GraphQLString }, // </em>
		preTag: { type: GraphQLString }, // <em>
		properties: { type: createInputObjectType({ name: 'SearchHighlightArgProperties', fields: fieldsObj})},
		requireFieldMatch: { type: GraphQLBoolean }, // true false
		tagsSchema: { type: GraphQLString } // styled
	}});
} // buildHighlightArg


export function buildHighlights() {
	const fieldsObj = {};
	getCachedFields().forEach((field) => {
		fieldsObj[field] = {type: createObjectType({name: `HighlightsProperties${field}`, fields: {
			fragmenter: { type: GraphQLString }, // span simple
			fragmentSize: { type: GraphQLInt },  // 100
			numberOfFragments: { type: GraphQLInt }, // 5
			noMatchSize: { type: GraphQLInt }, // 0
			order: { type: GraphQLString }, // none score
			preTag: { type: GraphQLString }, // <em>
			postTag: { type: GraphQLString }, // </em>
			requireFieldMatch: { type: GraphQLBoolean } // true false
		}})};
	});
	return {type: createObjectType({ name: 'Highlights', fields: {
		encoder: { type: GraphQLString }, // default html
		fragmenter: { type: GraphQLString }, // span simple
		fragmentSize: { type: GraphQLInt },  // 100
		noMatchSize: { type: GraphQLInt }, // 0
		numberOfFragments: { type: GraphQLInt }, // 5
		order: { type: GraphQLString }, // none score
		postTag: { type: GraphQLString }, // </em>
		preTag: { type: GraphQLString }, // <em>
		properties: { type: createObjectType({ name: 'HighlightsProperties', fields: fieldsObj})},
		requireFieldMatch: { type: GraphQLBoolean }, // true false
		tagsSchema: { type: GraphQLString } // styled
	}})};
} // buildHighlights


export function buildHitFields() {
	const fieldsObj = {};
	getCachedFields().forEach((field) => {
		fieldsObj[field] = { type: GraphQLString };
	}); // forEach
	return fieldsObj;
} // buildHitFields


export function buildHitFieldsComplex() {
	const fieldsObj = {};
	getCachedFields().forEach((field) => {
		fieldsObj[field] = {
			args: {
				highlight: createInputObjectType({name: `SearchResultHitField${field}ArgsHighlight`, fields: {
					//encoder: { type: GraphQLString }, // default html
					fragmenter: { type: GraphQLString }, // span simple
					fragmentSize: { type: GraphQLInt },  // 100
					numberOfFragments: { type: GraphQLInt }, // 5
					noMatchSize: { type: GraphQLInt }, // 0
					order: { type: GraphQLString }, // none score
					preTag: { type: GraphQLString }, // <em>
					postTag: { type: GraphQLString }, // </em>
					requireFieldMatch: { type: GraphQLBoolean }//, // true false
					//tagsSchema: { type: GraphQLString } // styled
				}})
			},
			resolve: (env) => {
				//log.info(`env:${toStr(env)}`);
				const {
					args = {},
					source
				} = env;
				//log.info(`args:${toStr(args)}`);
				const {highlight = {}} = args;
				//log.info(`highlight:${toStr(highlight)}`);
				const {
					//encoder = 'default',
					fragmenter = 'span',
					fragmentSize = 100,
					numberOfFragments = 5,
					noMatchSize = 0,
					order = 'none',
					preTag = '<em>',
					postTag = '</em>',
					requireFieldMatch = true//,
					//tagsSchema = 'styled'
				} = highlight;
				//log.info(`preTag:${toStr(preTag)}`);
				//log.info(`postTag:${toStr(postTag)}`);
				//return source[field];
				return {
					args: {
						highlight: {
							fragmenter,
							fragmentSize,
							numberOfFragments,
							noMatchSize,
							order,
							preTag,
							postTag,
							requireFieldMatch
						}
					},
					value: source[field]
				};
			},
			//type: GraphQLString
			type: createObjectType({ name: `SearchResultHitField${field}Resolved`, fields: {
				highlight: { type: createObjectType({ name: `SearchResultHitField${field}ResolvedHighlight`, fields: {
					//encoder: { type: GraphQLString }, // default html
					fragmenter: { type: GraphQLString }, // span simple
					fragmentSize: { type: GraphQLInt },  // 100
					numberOfFragments: { type: GraphQLInt }, // 5
					noMatchSize: { type: GraphQLInt }, // 0
					order: { type: GraphQLString }, // none score
					preTag: { type: GraphQLString }, // <em>
					postTag: { type: GraphQLString }, // </em>
					requireFieldMatch: { type: GraphQLBoolean }//, // true false
					//tagsSchema: { type: GraphQLString } // styled
				}})},
				value: { type: GraphQLString }
			}})
		}; // fieldsObj[field]
	}); // forEach
	return fieldsObj;
} // buildHitFieldsComplex


export function buildMustExistFieldsArg() {
	const fields = {};
	getCachedFields().forEach((field) => {
		fields[field] = { type: GraphQLBoolean };
	});
	//log.info(`fields:${toStr(fields)}`);
	return createInputObjectType({
		name: 'SearchMustExistFieldsArg',
		fields
	});
} // buildMustExistFieldsArg


export function buildQueryArg() {
	const fields = {};
	getCachedFields().forEach((field) => {
		fields[field] = {
			type: GraphQLInt
		};
	});
	//log.info(`fields:${toStr(fields)}`);
	return createInputObjectType({ name: 'SearchQueryArg', fields: {
		fulltext: { type: createInputObjectType({ name: 'SearchQueryArgFulltext', fields: {
			fields: { type: createInputObjectType({
				name: 'SearchQueryArgFulltextFields',
				fields
			})},
			operator: { type: GraphQLString } // AND OR
		}})},
		ngram: { type: createInputObjectType({ name: 'SearchQueryArgNgram', fields: {
			fields: { type: createInputObjectType({
				name: 'SearchQueryArgNgramFields',
				fields
			})},
			operator: { type: GraphQLString } // AND OR
		}})}
	}});
} // buildQueryArg
