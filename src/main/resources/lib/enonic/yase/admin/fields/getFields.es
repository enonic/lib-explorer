import {NT_FIELD} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';


export function getFields({
	connection = connectRepo()
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
