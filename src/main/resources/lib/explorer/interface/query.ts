import type {Filter} from '/lib/xp/node';
import type {
	InterfaceNode,
	QueryFilters,
	RepoConnection
} from '@enonic-types/lib-explorer';


import {addQueryFilter} from '@enonic/js-utils';
import {NT_INTERFACE} from '/lib/explorer/model/2/constants';
import {hasValue} from '/lib/explorer/query/hasValue';


export function query({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {} as Filter,
	query = '', //"_parentPath = '/interfaces'",
	sort = '_name ASC'
} :{
	connection: RepoConnection
	count?: number
	filters?: Filter | Filter[]
	query?: string
	sort?: string
}) {
	filters = addQueryFilter({
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
		hits: queryRes.hits.map(hit => connection.get<InterfaceNode>(hit.id)),
		total: queryRes.total,
	};
	return interfaceQueryResponse;
}
