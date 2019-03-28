import {NT_FIELD} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';


export function getFields({
	connection = connect()
} = {}) {
	const queryParams = {
		count: -1,
		filters: {
			boolean: {
				must: [{
					hasValue: {
						field: 'type',
						values: [NT_FIELD]
					}
				}]
			}
		},
		query: '', //"_parentPath = '/fields'",
		sort: '_name ASC'
	};
	const queryRes = connection.query(queryParams);
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	return queryRes;
}
