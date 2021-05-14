import {NT_FIELD} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
//import {forceArray} from '/lib/util/data';
//import {toStr} from '/lib/util';


export function getFields({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	fields,
	filters = {},
	sort = '_name ASC'
} = {}) {
	addFilter({
		clause: 'should', // One or more of the functions in the should array must evaluate to true for the filter to match
		filter: hasValue('_nodeType', [NT_FIELD]),
		filters
	});
	addFilter({
		clause: 'should', // One or more of the functions in the should array must evaluate to true for the filter to match
		filter: hasValue('type', [NT_FIELD]),
		filters
	});
	if (fields) {
		addFilter({
			filter: hasValue('key', fields), // _allText
			filters // reference gets modified
		});
	}
	//log.debug(`filters:${toStr(filters)}`);
	const queryParams = {
		count: -1,
		filters,
		query: '', //"_parentPath = '/fields'",
		sort
	};
	const queryRes = connection.query(queryParams);
	//log.info(`queryRes:${toStr(queryRes)}`);
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	return queryRes;
}
