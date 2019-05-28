export function query({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {},
	query = '',
	sort = '_name ASC'
}) {
	const queryParams = {
		count,
		filters,
		query,
		sort
	};
	const queryRes = connection.query(queryParams);
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	return queryRes;
}
