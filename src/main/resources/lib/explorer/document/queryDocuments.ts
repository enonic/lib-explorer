import type {
	QueryDSL,
	SortDSLExpression
} from '@enonic/js-utils/src/types';
import type {
	Aggregations,
	QueryFilters,
	RepoConnection
} from '/lib/explorer/types/index.d';


import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';
import {NT_DOCUMENT} from '/lib/explorer/constants';


export function queryDocuments<
	AggregationKey extends undefined|string = undefined
>({
	// Required
	collectionRepoReadConnection,
	// Optional
	aggregations,
	count = 1,
	filters,
	query: queryParam,
	sort/* = {
		direction: 'DESC',
		field: '_score'
	}*/,
	start
} :{
	// Required
	collectionRepoReadConnection :RepoConnection
	// Optional
	aggregations ?:Aggregations<AggregationKey>
	count ?:number
	filters ?:QueryFilters
	query ?:QueryDSL
	sort? :SortDSLExpression
	start ?:number
}) {
	const query :QueryDSL = {
		boolean: {
			must: [{
				term: {
					field: '_nodeType',
					value: NT_DOCUMENT
				}
			}]
		}
	};
	if (queryParam && queryParam.boolean) {
		if (queryParam.boolean.must) {
			query.boolean.must = [].concat(
				query.boolean.must,
				forceArray(queryParam.boolean.must)
			);
		} else {
			query.boolean = {
				...query.boolean,
				...queryParam.boolean
			}
		}
	}

	const queryParams = {
		aggregations,
		count,
		filters,
		query,
		sort,
		start
	};
	//log.debug('queryDocuments queryParams:%s', toStr(queryParams));

	const documentsRes = collectionRepoReadConnection.query(queryParams);
	//log.debug('queryDocuments documentsRes:%s', toStr(documentsRes));

	return documentsRes;
}
