//import {toStr} from '@enonic/js-utils';

import {NT_STOP_WORDS} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
import {get} from '/lib/explorer/stopWords/get';


export function query({
	aggregations = {},
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {},
	query = '',
	sort = '_name ASC',
	start = 0
} = {}) {
	addFilter({
		filter: hasValue('_nodeType', [NT_STOP_WORDS]),
		filters
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
