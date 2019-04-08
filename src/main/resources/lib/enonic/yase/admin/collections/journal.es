//import {toStr} from '/lib/enonic/util';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {menu} from '/lib/enonic/yase/admin/collections/menu';

import {
	JOURNALS_REPO,
	NT_JOURNAL,
	PRINCIPAL_YASE_READ
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';


const queryJournals = ({
	count = 10,
	filters = {},
	query = '',
	sort = 'startTime DESC',
	start
} = {}) => {
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


export const journal = ({
	path
}) => {
	const journals = queryJournals().hits.map(({
		name, startTime, endTime, duration,
		errorCount, successCount//, errors, successes
	}) => `<tr>
	<td data-sort-value="${name}">${name}</td>
	<td data-sort-value="${startTime}">${startTime}</td>
	<td data-sort-value="${endTime}">${endTime}</td>
	<td data-sort-value="${duration}">${duration}</td>
	<td data-sort-value="${errorCount}">${errorCount}</td>
	<td data-sort-value="${successCount}">${successCount}</td>
</tr>`);
	return htmlResponse({
		bodyBegin: [
			menu({path})
		],
		main: `<table class="celled compact selectable sortable striped table ui">
		<thead>
			<tr>
				<th>Collection</th>
				<th class="sorted descending">Start</th>
				<th>End</th>
				<th>Duration</th>
				<th>Errors</th>
				<th>Successes</th>
			</tr>
		</thead>
		<tbody>
			${journals.join('')}
		</tbody>
</table>`,
		path,
		title: 'Journal'
	})
} // history
