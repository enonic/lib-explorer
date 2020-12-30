import {NT_FIELD} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
//import {forceArray} from '/lib/util/data';
//import {toStr} from '/lib/util';


export function getFields({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	fields
} = {}) {
	const filters = addFilter({
		filter: hasValue('type', [NT_FIELD])
	});
	if (fields) {
		addFilter({
			filter: hasValue('key', fields), // _allText
			filters // reference gets modified
		});
	}
	//log.info(`filters:${toStr(filters)}`);
	const queryParams = {
		count: -1,
		filters,
		query: '', //"_parentPath = '/fields'",
		sort: '_name ASC'
	};
	const queryRes = connection.query(queryParams);
	//log.info(`queryRes:${toStr(queryRes)}`);
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	return queryRes;
}
