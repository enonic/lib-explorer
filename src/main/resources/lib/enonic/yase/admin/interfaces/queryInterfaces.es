import {NT_INTERFACE} from '/lib/enonic/yase/constants';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';


export function queryInterfaces({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {},
	query = '', //"_parentPath = '/interfaces'",
	sort = '_name ASC'
} = {}) {
	const queryParams = {
		count,
		filters: addFilter({
			filters,
			filter: hasValue('type', [NT_INTERFACE])
		}),
		query,
		sort
	};
	const queryRes = connection.query(queryParams);
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	return queryRes;
}
