import type {
	QueryNodeParams,
	RepoConnection,
} from '/lib/xp/node';
import type {Aggregations} from '@enonic/js-utils/types/node/query/Aggregation.d';
import type {
	Highlight,
	SynonymNode
} from '@enonic-types/lib-explorer';


import {
	addQueryFilter,
	//forceArray,
	toStr
} from '@enonic/js-utils';
import {NT_SYNONYM} from '/lib/explorer/constants';
import {hasValue} from '/lib/explorer/query/hasValue';
import {moldQueriedSynonymNode} from '/lib/explorer/synonym/moldQueriedSynonymNode';


export type QuerySynonymsParams<
	AggregationKeys extends undefined|string = undefined
> = {
	aggregations?: Aggregations<AggregationKeys>
	connection: RepoConnection
	count?: QueryNodeParams['count']
	explain?: QueryNodeParams['explain']
	filters?: QueryNodeParams['filters']
	highlight?: Highlight
	query?: QueryNodeParams['query']
	sort?: QueryNodeParams['sort']
	start?: QueryNodeParams['start']
}


export function query<
	AggregationKeys extends undefined|string = undefined
>({
	aggregations,
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	explain = false,
	filters,
	highlight = {
		/*numberOfFragments: 10,
		postTag: '</b>',
		preTag: '<b>',
		properties: {
			from: {},
			to: {}
		}*/
	},
	query,
	sort = {
		field: '_name',
		direction: 'ASC'
	},
	start = 0
} :QuerySynonymsParams<AggregationKeys>) {
	/*log.debug('synonym.query(%s)', toStr({
		aggregations,
		count,
		filters,
		query,
		sort,
		start
	}));*/
	//log.debug('highlight:%s', toStr(highlight));

	filters = addQueryFilter({
		filter: hasValue('_nodeType', [NT_SYNONYM]),
		filters
	});
	//log.debug('synonym.query filters:%s', toStr(filters));

	const queryParams = {
		aggregations,
		count,
		explain,
		filters,
		highlight,
		query,
		sort,
		start
	};
	if (explain) {
		log.debug('synonym.query queryParams:%s', toStr(queryParams));
	}

	const queryRes = connection.query(queryParams);
	//log.debug('synonym.query queryRes:%s', toStr(queryRes));

	const synonymQueryRes = {
		aggregations: queryRes.aggregations,
		count: queryRes.count,
		hits: queryRes.hits.map((hit) => {
			//log.debug('synonym.query hit:%s', toStr(hit));

			const {
				id: _id,
				highlight: _highlight,
				score: _score
			} = hit;

			const node = connection.get(_id) as SynonymNode;
			//log.info('synonym.query node:%s', toStr(node));
			if (!node) { // Handle ghost nodes
				return null;
			}

			return moldQueriedSynonymNode({
				...node,
				_highlight,
				_score
			});
		}).filter(x => x),// as Array<QueriedSynonym>,
		total: queryRes.total
	};
	//log.info(`synonymQueryRes:${toStr(synonymQueryRes)}`);
	return synonymQueryRes;
} // function query
