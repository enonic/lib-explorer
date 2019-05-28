//import {toStr} from '/lib/util';
import {
	REPO_JOURNALS,
	NT_JOURNAL,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';


export function query({
	aggregations = {},
	count = 25,
	filters = {},
	query = '',
	sort = 'endTime DESC',
	start
} = {}) {
	const connection = connect({
		repoId: REPO_JOURNALS,
		principals: [PRINCIPAL_EXPLORER_READ]
	});
	const queryParams = {
		aggregations,
		count,
		filters: addFilter({
			filters,
			filter: hasValue('type', [NT_JOURNAL])
		}),
		query,
		sort,
		start
	};
	//log.info(toStr({queryParams}));
	const queryRes = connection.query(queryParams);
	//log.info(toStr({queryRes}));
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	//log.info(toStr({queryRes}));
	return queryRes;
}
