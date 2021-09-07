import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';

import {NT_SYNONYM} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';


export function query({
	aggregations = {},
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {},
	highlight = {
		/*numberOfFragments: 10,
		postTag: '</b>',
		preTag: '<b>',
		properties: {
			from: {},
			to: {}
		}*/
	},
	query = '',
	sort = '_name ASC',
	start = 0
} = {}) {
	//log.info(toStr({connection, count, filters, query, sort}));
	addFilter({
		filter: hasValue('_nodeType', [NT_SYNONYM]),
		filters
	});
	const queryParams = {
		aggregations,
		count,
		filters,
		highlight,
		query,
		sort,
		start
	};
	//log.info(toStr({queryParams}));
	const queryRes = connection.query(queryParams);
	//log.info(`queryRes:${toStr(queryRes)}`);
	queryRes.hits = queryRes.hits.map((hit) => {
		const node = connection.get(hit.id);
		if (!node) { // Handle ghost nodes
			return null;
		}
		const {
			//_id,
			//_name,
			_nodeType,
			_path,
			//displayName, // TODO We want to remove displayName
			from,
			thesaurusReference,
			to//,
			//type
		} = node;
		return {
			_highlight: hit.highlight,
			_id: hit.id,
			//_name, // Name is random and useless...
			_nodeType,
			_path,
			_score: hit.score,
			//displayName, // TODO We want to remove displayName
			from: forceArray(from),
			//highlight: hit.highlight,
			//id: hit.id,
			//name: _name,
			thesaurus: _path.match(/[^/]+/g)[1],
			thesaurusReference,
			//score: hit.score,
			to: forceArray(to)//,
			//type
		};
	}).filter(x => x);
	//log.info(`queryRes:${toStr(queryRes)}`);
	return queryRes;
} // function query
