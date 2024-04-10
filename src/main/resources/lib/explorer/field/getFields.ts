import type {
	Field,
	FieldNode,
	RepoConnection
} from '@enonic-types/lib-explorer';


import {
	addQueryFilter,
	isStringLiteral,
	toStr
} from '@enonic/js-utils';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import {
	NT_FIELD,
	SYSTEM_FIELDS
} from '/lib/explorer/model/2/constants';
import {coerceFieldType} from '/lib/explorer/field/coerceFieldType';
import {hasValue} from '/lib/explorer/query/hasValue';


export function getFields({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	fields = [], // Used in GraphQL queryFields
	includeSystemFields = false
} :{
	connection :RepoConnection
	fields? :Array<string>
	includeSystemFields? :boolean
}) {
	let filters = addQueryFilter({
		filter: hasValue('_nodeType', [NT_FIELD])
	});
	if (fields) {
		if (isStringLiteral(fields)) {
			fields = [fields];
		}
		if (!Array.isArray(fields)) {
			throw new Error(`Invalid fields parameter! Must be string or Array<string> fields:${toStr(fields)}`);
		}
		filters = addQueryFilter({
			filter: hasValue('key', fields),
			filters // reference gets modified
		});
	}
	//log.debug(`filters:${toStr(filters)}`);
	const queryParams = {
		count: -1, // Always get all fields
		filters,
		query: '', //"_parentPath = '/fields'",
		sort: 'key ASC'
	};
	const queryRes = connection.query(queryParams);
	//log.info(`queryRes:${toStr(queryRes)}`);

	const fieldsArray :Array<Field & {
		isSystemField :boolean
	}> = queryRes.hits.map(hit => {
		const node = connection.get<FieldNode>(hit.id);
		return {
			...coerceFieldType(node),
			isSystemField: false
		} as Field & {
			isSystemField :boolean
		};
	});

	const getFieldsResponse = {
		count: queryRes.count,
		hits: fieldsArray,
		total: queryRes.total
	};

	if (!includeSystemFields) return getFieldsResponse;

	// Add system fields
	const maybeFilteredSystemFields = fields
		? SYSTEM_FIELDS.filter(({key}) => arrayIncludes(fields, key))
		: SYSTEM_FIELDS;
	getFieldsResponse.count += maybeFilteredSystemFields.length;
	getFieldsResponse.total += maybeFilteredSystemFields.length;
	maybeFilteredSystemFields.forEach((field) => {
		field.isSystemField = true;
		field.valueType = field.fieldType; // TODO transition to valueType everywhere and remove fieldType
		getFieldsResponse.hits.push(field);
	});

	getFieldsResponse.hits.sort((a,b) => { // Sorts array in place
		if (a.key < b.key) {
			return -1;
		}
		if (a.key > b.key) {
			return 1;
		}
		return 0;
	});

	//log.debug(`getFieldsResponse:${toStr(getFieldsResponse)}`);
	return getFieldsResponse;
}
