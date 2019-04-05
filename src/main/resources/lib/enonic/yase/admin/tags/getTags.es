//import {toStr} from '/lib/enonic/util';

import {NT_TAG} from '/lib/enonic/yase/constants';


export function getTags({
	connection // Connecting many places leeds to loss of control over principals, so pass a connection around.
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
