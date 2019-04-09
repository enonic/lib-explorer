//import {toStr} from '/lib/enonic/util';
import {
	JOURNALS_REPO,
	NT_JOURNAL,
	PRINCIPAL_YASE_READ
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';


export function query({
	count = 25,
	filters = {},
	query = '',
	sort = 'startTime DESC',
	start
} = {}) {
	const connection = connect({
		repoId: JOURNALS_REPO,
		principals: [PRINCIPAL_YASE_READ]
	});
	const queryParams = {
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
