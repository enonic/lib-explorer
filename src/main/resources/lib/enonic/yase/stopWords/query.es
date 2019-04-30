//import {toStr} from '/lib/enonic/util';

import {NT_STOP_WORDS} from '/lib/enonic/yase/constants';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';
import {get} from '/lib/enonic/yase/stopWords/get';


export function query({
	aggregations = {},
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {},
	query = '',
	sort = '_name ASC',
	start = 0
} = {}) {
	filters = addFilter({
		filters,
		filter: hasValue('type', [NT_STOP_WORDS])
	});
	const queryParams = {
		aggregations,
		count,
		filters,
		query,
		sort,
		start
	};
	//log.info(toStr({queryParams}));
	const queryRes = connection.query(queryParams);
	//log.info(toStr({queryRes}));
	queryRes.hits = queryRes.hits.map((hit) => {
		const obj = get({connection, id: hit.id});
		obj.score = hit.score;
		return obj;
	}).filter(x => x);
	return queryRes;
}
