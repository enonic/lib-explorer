//import {toStr} from '/lib/enonic/util';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {menu} from '/lib/enonic/yase/admin/collections/menu';
import {query} from '/lib/enonic/yase/journal/query';


export const journal = ({
	path
}) => {
	const journals = query().hits.map(({
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
