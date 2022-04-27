import type {Journal} from '../journal/types.d';

//import {toStr} from '@enonic/js-utils';

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
	start = 10
} = {}) {
	const connection = connect({
		repoId: REPO_JOURNALS,
		principals: [PRINCIPAL_EXPLORER_READ]
	});
	addFilter({
		filter: hasValue('_nodeType', [NT_JOURNAL]),
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
	//log.info(toStr({queryParams}));

	const queryRes = connection.query(queryParams);
	//log.info(toStr({queryRes}));

	const journalQueryRes = {
		aggregations: queryRes.aggregations,
		count: queryRes.count,
		hits: queryRes.hits.map(hit => {
			//log.info(toStr({node}));
			const node = connection.get(hit.id) as Journal;
			if (!node.errors) {
				node.errors = [];
			} else if (!Array.isArray(node.errors)) {
				node.errors = [node.errors];
			}
			if (!node.successes) {
				node.successes = [];
			} else if (!Array.isArray(node.successes)) {
				node.successes = [node.successes];
			}
			//log.info(toStr({node}));
			return node;
		}),
		total: queryRes.total
	};
	//log.info('journalQueryRes:%s', toStr(journalQueryRes));
	return journalQueryRes;
}
