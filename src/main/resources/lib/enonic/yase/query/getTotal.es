export function getTotal({
	connection,
	filters,
	query = ''
}) {
	return connection.query({
		count: 0,
		filters,
		query
	}).total;
}
