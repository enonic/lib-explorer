//import {toStr} from '/lib/util';


export function query({
	aggregations,
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
	//log.info(`queryRes.hits:${toStr(queryRes.hits)}`);

	return queryRes;
}
