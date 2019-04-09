import {RT_JSON} from '/lib/enonic/yase/constants';
import {query} from '/lib/enonic/yase/journal/query';


export function get({
	params: {
		page = 1, // NOTE First index is 1 not 0
		perPage = 25,
		sort = 'startTime DESC'
	}
}) {
	const result = query({
		count: perPage,
		sort,
		start: (page - 1 ) * perPage
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
				page,
				perPage,
				sort
			},
			result
		}
	};
}
