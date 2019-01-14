//import {toStr} from '/lib/enonic/util';

import {NT_TAG} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';


export function getTags({
	connection = connectRepo()
} = {}) {
	const queryParams = {
		count: -1,
		filters: {
			boolean: {
				must: [{
					hasValue: {
						field: 'type',
						values: [NT_TAG]
					}
				}]
			}
		},
		query: '', //"_parentPath = '/tags'",
		sort: '_path ASC'
	};
	//log.info(toStr({queryParams}));

	const queryRes = connection.query(queryParams);
	//log.info(toStr({queryRes}));

	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	//log.info(toStr({queryRes}));
	return queryRes;
}
