import type {RepoConnection} from '/lib/explorer/types/index.d';


import {NT_INTERFACE} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';


export function query({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {},
	query = '', //"_parentPath = '/interfaces'",
	sort = '_name ASC'
} :{
	connection :RepoConnection
	count? :number
	filters? :{}
	query? :string
	sort? :string
}) {
	addFilter({
		filter: hasValue('_nodeType', [NT_INTERFACE]),
		filters
	});
	const queryParams = {
		count,
		filters,
		query,
		sort
	};
	const queryRes = connection.query(queryParams);

	const interfaceQueryResponse = {
		count: queryRes.count,
		hits: queryRes.hits.map(hit => connection.get(hit.id)),
		total: queryRes.total,
	};
	return interfaceQueryResponse;
}
