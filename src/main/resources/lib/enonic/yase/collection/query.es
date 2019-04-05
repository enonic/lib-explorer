import {NT_COLLECTION} from '/lib/enonic/yase/constants';


export function query({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	query = '', //"_parentPath = '/collections'",
	sort = '_name ASC'
} = {}) {
	const queryParams = {
		count,
		filters: {
			boolean: {
				must: [{
					hasValue: {
						field: 'type',
						values: [NT_COLLECTION]
					}
				}]
			}
		},
		query,
		sort
	};
	const queryRes = connection.query(queryParams);
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	return queryRes;
}
