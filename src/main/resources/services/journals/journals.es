import {RT_JSON} from '/lib/enonic/yase/constants';
import {query as queryJournals} from '/lib/enonic/yase/journal/query';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';


export function get({
	params: {
		page = 1, // NOTE First index is 1 not 0
		perPage = 25,
		query = '',
		sort = 'endTime DESC'
	}
}) {
	const intPerPage = parseInt(perPage, 10);
	const intPage = parseInt(page, 10);
	const result = queryJournals({
		aggregations: {
			collection: {
				terms: {
        			field: 'name',
        			order: '_count desc',
        			size: 100
      			}
			},
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
		},
		count: intPerPage,
		/*filters: addFilter({
			filter: hasValue('name', ['example'])
		}),*/
		query,
		sort,
		start: (intPage - 1 ) * intPerPage
	});
	result.hits = result.hits.map(({
		name, startTime, endTime, duration,
		errorCount, successCount//, errors, successes
	}) => ({
		name, startTime, endTime, duration,
		errorCount, successCount//, errors, successes
	}));
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
