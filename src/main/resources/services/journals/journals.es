//import {toStr} from '/lib/enonic/util';
//import {forceArray} from '/lib/enonic/util/data';
import {RT_JSON} from '/lib/enonic/yase/constants';
import {query as queryJournals} from '/lib/enonic/yase/journal/query';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';


export function get({
	params: {
		collections,
		page = 1, // NOTE First index is 1 not 0
		perPage = 25,
		query = '',
		sort = 'endTime DESC'
	}
}) {
	//log.info(toStr({collections}));
	const intPerPage = parseInt(perPage, 10);
	const intPage = parseInt(page, 10);
	const start = (intPage - 1 ) * intPerPage;

	const filters = {};

	if(collections) {
		addFilter({
			filters,
			filter: hasValue('name', collections.split(','))
		});
	}

	const result = queryJournals({
		/*aggregations: {
			errorRanges: {
				range: {
					field: 'errorCount',
					ranges: [{
						to: 1
					}, {
						from: 1
					}]
				}
			},
			successRanges: {
				range: {
					field: 'successCount',
					ranges: [{
						to: 1
					}, {
						from: 1
					}]
				}
			},
			startTime: {
				dateRange: {
					field: 'startTime',
					format: 'yyyy-MM-dd', // Does this give the sort order?
					ranges: [{
						//from: '',
						to: 'now-1y'
					}, {
						from: 'now-1y',
						to: 'now-1M'
					}, {
						from: 'now-1M',
						to: 'now-6d'
					}, {
						from: 'now-6d',
						to: 'now-1d'
					}, {
						from: 'now-1d',
						to: 'now'
					}]
				}
			}
		},*/
		count: intPerPage,
		filters,
		query,
		sort,
		start
	});
	result.page = intPage;
	result.start = start + 1;
	result.end = Math.min(start + intPerPage, result.total);
	result.totalPages = Math.ceil(result.total / intPerPage);
	result.hits = result.hits.map(({
		name, startTime, endTime, duration,
		errorCount, successCount//, errors, successes
	}) => ({
		name, startTime, endTime, duration,
		errorCount, successCount//, errors, successes
	}));

	// Separate aggregation query where the collections filter is not included
	const collectionsAggregationQueryResult = queryJournals({
		aggregations: {
			collection: {
				terms: {
        			field: 'name',
        			order: '_count desc',
        			size: 100
      			}
			}
		},
		count: 0,
		filters: {},
		query
	});
	result.aggregations.collection = collectionsAggregationQueryResult.aggregations.collection;

	return {
		contentType: RT_JSON,
		body: {
			params: {
				page: intPage,
				perPage: intPerPage,
				query,
				sort
			},
			result
		}
	};
}
