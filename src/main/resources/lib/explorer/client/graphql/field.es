import {newCache} from '/lib/cache';
import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {getFields} from '/lib/explorer/field/getFields';
import {camelize} from '/lib/explorer/string/camelize';
import {
	createInputObjectType,
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


export function buildHitFields() {
	const fieldsObj = {};
	getCachedFields().forEach((field) => {
		fieldsObj[field] = { type: GraphQLString };
	});
	return fieldsObj;
} // buildHitFields


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
		fields[field] = { type: GraphQLInt };
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
