import type {Filter} from '/lib/xp/node';
import type {Aggregations} from '@enonic/js-utils/types/node/query/Aggregation.d';
import type {
	JournalNode,
	QueryFilters
} from '@enonic-types/lib-explorer';


import {
	addQueryFilter,
	// toStr
} from '@enonic/js-utils';
import {coerceJournalType} from '/lib/explorer/journal/coerceJournalType';
import {
	REPO_JOURNALS,
	NT_JOURNAL,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {hasValue} from '/lib/explorer/query/hasValue';


export function query<
	AggregationKeys extends undefined|string = undefined
>({
	aggregations,
	count = 25,
	filters = {} as Filter,
	query = '',
	sort = 'endTime DESC',
	start = 10
} :{
	aggregations?: Aggregations<AggregationKeys>
	count?: number
	filters?: QueryFilters
	query?: string
	sort?: string
	start?: number
} = {}) {
	const connection = connect({
		repoId: REPO_JOURNALS,
		principals: [PRINCIPAL_EXPLORER_READ]
	});
	filters = addQueryFilter({
		filter: hasValue('_nodeType', [NT_JOURNAL]),
		filters
	}) as Filter;
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
			const journal = coerceJournalType(connection.get<JournalNode>(hit.id));
			// log.info('journal:%s', toStr(journal));
			return journal;
		}),
		total: queryRes.total
	};
	//log.info('journalQueryRes:%s', toStr(journalQueryRes));
	return journalQueryRes;
}
