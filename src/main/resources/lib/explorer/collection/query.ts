import type {
	// Aggregation,
	// AggregationToAggregationResult,
	Aggregations,
	AggregationsToAggregationResults,
	// AggregationsResult
} from '@enonic-types/core';
import type {
	CollectionNode,
	QueriedCollection,
	QueryFilters,
	RepoConnection
} from '/lib/explorer/types/index.d';


import {
	addQueryFilter,
	isNotSet,
	isSet//,
	//toStr
} from '@enonic/js-utils';

import {NT_COLLECTION} from '/lib/explorer/constants';
import {hasValue} from '/lib/explorer/query/hasValue';


export function query({
	aggregations,
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count,// = -1, // This is almost the same as perPage.
	filters = {},
	query = '', //"_parentPath = '/collections'",
	page,// = '1', // NOTE First index is 1 not 0
	perPage = '10', // This is almost the same as count.
	sort = '_name ASC',
	start = 0
}: {
	// Required
	connection: RepoConnection
	// Optional
	aggregations?: Aggregations
	count?: number
	filters?: QueryFilters
	query?: string
	page?: string//|number
	perPage?: string//|number
	sort?: string
	start?: number
}) {
	//log.info(toStr({count,page,perPage,sort,start}));
	// When neither count nor page is passed: count=-1 page=null
	// When both count and page is passed: count=-1 page=null
	// When only count is passed: page=null
	// When only page is passed: count=perPage
	// Summary: Count rules
	let intPerPage: number;
	let intPage: number;
	if (isNotSet(count)) {
		if(isSet(page)) {
			intPerPage = parseInt(perPage, 10);
			count = intPerPage;
			intPage = parseInt(page, 10);
			start = (intPage - 1 ) * intPerPage;
		} else {
			count=-1;
		}
	}
	//log.info(toStr({count,sort,start}));

	const queryParams = {
		aggregations,
		count,
		filters: addQueryFilter({
			clause: 'must',
			filter: hasValue('_nodeType', [NT_COLLECTION]),
			filters
		}),
		query,
		sort,
		start
	};
	//log.debug(`queryParams:${toStr(queryParams)}`);

	const queryRes = connection.query(queryParams);

	const collectionQueryRes: {
		aggregations: AggregationsToAggregationResults<Aggregations>
		count: number
		hits: QueriedCollection[]
		total: number
		// Optional
		page?: number
		pageStart?: number
		pageEnd?: number
		pagesTotal?: number
	} = {
		aggregations: queryRes.aggregations,
		count: queryRes.count,
		hits: queryRes.hits.map(({
			id,
			score
		}) => ({
			...connection.get(id) as CollectionNode,
			_score: score
		} as QueriedCollection)),
		total: queryRes.total
	};

	if(isSet(intPage)) {
		collectionQueryRes.page = intPage;
		collectionQueryRes.pageStart = start + 1;
		collectionQueryRes.pageEnd = Math.min(start + intPerPage, queryRes.total);
		collectionQueryRes.pagesTotal = Math.ceil(queryRes.total / intPerPage);
	}

	//log.debug('queryParams:%s', toStr(queryParams));
	return collectionQueryRes;
}
