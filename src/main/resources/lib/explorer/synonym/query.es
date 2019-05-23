//import {toStr} from '/lib/util';
import {NT_SYNONYM} from '/lib/explorer/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';


export function query({
	aggregations = {},
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {},
	query = '',
	sort = '_name ASC',
	start = 0
} = {}) {
	//log.info(toStr({connection, count, filters, query, sort}));
	filters = addFilter({
		filters,
		filter: hasValue('type', [NT_SYNONYM])
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
		const node = connection.get(hit.id);
		if (!node) { // Handle ghost nodes
			return null;
		}
		const {
			_name,
			_path,
			displayName,
			from,
			to
		} = node;
		return {
			displayName,
			from,
			id: hit.id,
			name: _name,
			thesaurus: _path.match(/[^/]+/g)[1],
			score: hit.score,
			to
		};
	}).filter(x => x);
	return queryRes;
} // function query
