import {NT_COLLECTION} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';


export function getCollections({
	connection = connectRepo()
} = {}) {
	const queryParams = {
		count: -1,
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
		query: '', //"_parentPath = '/collections'",
		sort: '_name ASC'
	};
	const queryRes = connection.query(queryParams);
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	return queryRes;
}
