import {NT_COLLECTION} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';


export function query({
	connection = connect(),
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
