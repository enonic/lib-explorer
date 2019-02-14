import {NT_INTERFACE} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';


export function queryInterfaces({
	connection = connectRepo(),
	count = -1,
	query = '', //"_parentPath = '/interfaces'",
	sort = '_name ASC'
} = {}) {
	const queryParams = {
		count,
		filters: {
			boolean: {
				must: [{
					hasValue: {
						field: 'type',
						values: [NT_INTERFACE]
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
