import type {
	QueryDsl
} from '@enonic-types/core';
import type {
	// QueryDSL,
	SortDSLExpression
} from '@enonic/js-utils/types';
import type {
	Aggregations,
	QueryFilters,
	RepoConnection
} from '/lib/explorer/types/index.d';


import {
	forceArray,
	isBooleanDslExpression,
	hasOwnProperty
	//toStr
} from '@enonic/js-utils';
// import { hasOwnProperty } from '@enonic/js-utils/object/hasOwnProperty'; // Causes ModuleNotFoundError: Cannot find module, when running tests in app-explorer
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
}: {
	// Required
	collectionRepoReadConnection: RepoConnection
	// Optional
	aggregations?: Aggregations<AggregationKey>
	count?: number
	filters?: QueryFilters
	query?: QueryDsl
	sort?: SortDSLExpression
	start?: number
}) {
	const query: QueryDsl = {
		boolean: {
			must: [{
				term: {
					field: '_nodeType',
					value: NT_DOCUMENT
				}
			}]
		}
	} // satisfies QueryDsl;
	if (
		queryParam
		&& hasOwnProperty(queryParam, 'boolean')
	) {
		if (isBooleanDslExpression(queryParam['boolean'])) { // TODO: Overkill? Does this slow things down?
			if (hasOwnProperty(queryParam.boolean, 'must')) {
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
		} else {
			throw new TypeError(`queryDocuments: query.boolean is not a BooleanDslExpression!`);
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
	// log.debug('queryDocuments queryParams:%s', toStr(queryParams));
	// log.error('queryDocuments queryParams:%s', queryParams); // Useful when running tests in app-explorer

	const documentsRes = collectionRepoReadConnection.query(queryParams);
	//log.debug('queryDocuments documentsRes:%s', toStr(documentsRes));

	return documentsRes;
}
