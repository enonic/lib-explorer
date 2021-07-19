import {
	NT_FIELD,
	SYSTEM_FIELDS
} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
//import {forceArray} from '/lib/util/data';
//import {toStr} from '/lib/util';
//import {isNotSet} from '/lib/util/value';


export function getFields({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	fields, // Used in GraphQL queryFields
	includeSystemFields = false
} = {}) {
	const filters = addFilter({
		filter: hasValue('_nodeType', [NT_FIELD])
	});
	if (fields) {
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
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));

	if (!includeSystemFields) return queryRes;

	// Add system fields
	const maybeFilteredSystemFields = fields
		? SYSTEM_FIELDS.filter(({key}) => fields.includes(key))
		: SYSTEM_FIELDS;
	queryRes.count += maybeFilteredSystemFields.length;
	queryRes.total += maybeFilteredSystemFields.length;
	maybeFilteredSystemFields.forEach((field) => {
		field.isSystemField = true;
		queryRes.hits.push(field);
	});

	queryRes.hits.sort((a,b) => { // Sorts array in place
		if (a.key < b.key) {
			return -1;
		}
		if (a.key > b.key) {
			return 1;
		}
		return 0;
	});
	//log.debug(`queryRes:${toStr(queryRes)}`);

	return queryRes;
}
