import {
	NT_COLLECTOR//,
	//PATH_COLLECTORS
} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
//import {toStr} from '/lib/util';


export function query({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {},
	query = '',
	sort = '_name ASC'
} = {}) {
	addFilter({
		clause: 'should',
		filter: hasValue('_nodeType', [NT_COLLECTOR]),
		filters
	});
	addFilter({
		clause: 'should',
		filter: hasValue('type', [NT_COLLECTOR]),
		filters
	});
	const queryParams = {
		count,
		filters,
		query: query
			? `_parentPath = '/collectors' AND (${query})`
			: "_parentPath = '/collectors'",
		sort
	};
	//log.info(toStr({queryParams}));
	const queryRes = connection.query(queryParams);
	//log.info(toStr({queryRes}));
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	//log.info(toStr({queryRes}));
	return queryRes;
}
