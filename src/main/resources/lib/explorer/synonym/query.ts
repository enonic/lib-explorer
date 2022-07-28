import type {
	QueryDSL,
	SortDSLExpression
} from '@enonic/js-utils/src/types';
import type {Aggregations} from '@enonic/js-utils/src/types/node/query/Aggregation.d';
import type {
	Highlight,
	QueryFilters,
	QueriedSynonym,
	RepoConnection,
	SynonymNode
} from '/lib/explorer/types/index.d';


import {
	//forceArray,
	toStr
} from '@enonic/js-utils';
import {NT_SYNONYM} from '/lib/explorer/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
import {coerceSynonymType} from '/lib/explorer/synonym/coerceSynonymType';


export type QuerySynonymsParams<
	AggregationKeys extends undefined|string = undefined
> = {
	aggregations ?:Aggregations<AggregationKeys>
	connection :RepoConnection
	count ?:number
	explain ?:boolean
	filters ?:QueryFilters
	highlight ?:Highlight
	query ?:QueryDSL|string
	sort ?:SortDSLExpression|string
	start ?:number
}


export function query<
	AggregationKeys extends undefined|string = undefined
>({
	aggregations,
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	explain = false,
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

	addFilter({
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
	//log.info('synonym.query queryRes:%s', toStr(queryRes));

	const synonymQueryRes = {
		aggregations: queryRes.aggregations,
		count: queryRes.count,
		hits: queryRes.hits.map((hit) => {
			//log.info('synonym.query hit:%s', toStr(hit));

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

			return coerceSynonymType({
				...node,
				_highlight,
				_score
			}) as QueriedSynonym;
		}).filter(x => x),// as Array<QueriedSynonym>,
		total: queryRes.total
	};
	//log.info(`synonymQueryRes:${toStr(synonymQueryRes)}`);
	return synonymQueryRes;
} // function query
