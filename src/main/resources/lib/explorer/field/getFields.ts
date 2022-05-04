import type {RepoConnection} from '/lib/explorer/types/index.d';
import type {
	Field,
	FieldNode
} from '/lib/explorer/field/types.d';


import {
	VALUE_TYPE_STRING,
	isString,
	toStr
} from '@enonic/js-utils';

import {
	NT_FIELD,
	SYSTEM_FIELDS
} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
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
	const filters = addFilter({
		filter: hasValue('_nodeType', [NT_FIELD])
	});
	if (fields) {
		if (isString(fields)) {
			fields = [fields];
		}
		if (!Array.isArray(fields)) {
			throw new Error(`Invalid fields parameter! Must be string or Array<string> fields:${toStr(fields)}`);
		}
		addFilter({
			filter: hasValue('key', fields), // _allText
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

	const fieldsArray :Array<Field> = queryRes.hits.map(hit => {
		const {
			fieldType = VALUE_TYPE_STRING,
			isSystemField = false,
			...rest
		} = connection.get<FieldNode>(hit.id);
		return {
			...rest,
			fieldType,
			isSystemField,
			valueType: fieldType // TODO transition to valueType everywhere and remove fieldType
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
		? SYSTEM_FIELDS.filter(({key}) => fields.includes(key))
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
