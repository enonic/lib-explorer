import type {Aggregations} from '@enonic/js-utils/src/types/node/query/aggregation.d';
import type {
	Highlight,
	QueryFilters,
	RepoConnection
} from '/lib/explorer/types.d';
import type {
	QueriedSynonym,
	SynonymNode
} from './types.d';


import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';

import {NT_SYNONYM} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';


export function query<
	AggregationKeys extends undefined|string = undefined
>({
	aggregations,
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
} :{
	aggregations? :Aggregations<AggregationKeys>
	connection :RepoConnection
	count? :number
	filters? :QueryFilters
	highlight? :Highlight
	query? :string
	sort? :string
	start? :number
}) {
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

	const synonymQueryRes = {
		aggregations: queryRes.aggregations,
		count: queryRes.count,
		hits: queryRes.hits.map((hit) => {
			const node = connection.get(hit.id) as SynonymNode;
			if (!node) { // Handle ghost nodes
				return null;
			}
			const {
				//_id,
				//_name,
				//_nodeType,
				_path,
				//displayName, // TODO We want to remove displayName
				from,
				thesaurusReference,
				to//,
				//type
			} = node;
			const queriedSynonym :QueriedSynonym = {
				_highlight: queryRes.highlight[node._id],
				_id: hit.id,
				//_name, // Name is random and useless...
				//_nodeType,
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
			return queriedSynonym;
		}).filter(x => x),// as Array<QueriedSynonym>,
		total: queryRes.total
	};
	//log.info(`synonymQueryRes:${toStr(synonymQueryRes)}`);
	return synonymQueryRes;
} // function query
