import type {Filter} from '@enonic-types/core';
import type {Aggregations} from '@enonic/js-utils/types/node/query/Aggregation.d';
import type {
	Highlight,
	QueriedStopword,
	RepoConnection
} from '../types.d';


import {
	addQueryFilter,
	// toStr
} from '@enonic/js-utils';

import {NT_STOP_WORDS} from '/lib/explorer/model/2/constants';
import {hasValue} from '/lib/explorer/query/hasValue';
import {get} from '/lib/explorer/stopWords/get';


export function query<
	AggregationKeys extends undefined|string = undefined
>({
	aggregations,
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {} as Filter,
	query = '',
	sort = '_name ASC',
	start = 0
}: {
	aggregations?: Aggregations<AggregationKeys>
	connection: RepoConnection
	count?: number
	filters?: Filter | Filter[]
	highlight?: Highlight
	query?: string
	sort?: string
	start?: number
}) {
	filters = addQueryFilter({
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
	// log.info(toStr({queryParams}));

	const queryRes = connection.query(queryParams);
	// log.info(toStr({queryRes}));

	const stopwordsQueryRes = {
		aggregations: queryRes.aggregations,
		count: queryRes.count,
		hits: queryRes.hits.map((hit) => {
			const obj = get({
				connection,
				id: hit.id,
			}) as QueriedStopword;
			obj._score = hit.score;
			return obj;
		}).filter(x => x),
		total: queryRes.total,
	};
	// log.info('stopwordsQueryRes:%s', toStr(stopwordsQueryRes));
	return stopwordsQueryRes;
}
