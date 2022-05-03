//import {toStr} from '@enonic/js-utils';


export function query({
	aggregations = {},
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {},
	query = '',
	sort = '_name ASC'
}) {
	const queryParams = {
		aggregations,
		count,
		filters,
		query,
		sort
	};
	//log.info(`queryParams:${toStr(queryParams)}`);

	const queryRes = connection.query(queryParams);
	//log.info(`queryRes.hits:${toStr(queryRes.hits)}`);

	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	// WARNING Hits may contain null entries if there are ghost nodes.
	// (nodes that are in the index, that have been deleted)
	// Not doing the below so count and total stays correct.
	//.filter(x => x);

	//log.info(`queryRes.hits:${toStr(queryRes.hits)}`);

	return queryRes;
}
