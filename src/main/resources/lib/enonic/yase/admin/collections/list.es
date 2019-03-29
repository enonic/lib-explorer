//import {toStr} from '/lib/enonic/util';

import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {menu} from '/lib/enonic/yase/admin/collections/menu';
import {getDocumentCount} from '/lib/enonic/yase/collection/getDocumentCount';
import {query} from '/lib/enonic/yase/collection/query';
import {usedInInterfaces} from '/lib/enonic/yase/collection/usedInInterfaces';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export const list = ({
	path
}, {
	messages,
	status
} = {}) => {
	const collections = query();
	let totalCount = 0;
	//log.info(toStr({collections}));
	return htmlResponse({
		bodyBegin: [
			menu({path})
		],
		main: `<table class="collapsing compact ui sortable selectable celled striped table">
	<thead>
		<tr>
			<th class="sorted ascending">Name</th>
			<th>Documents</th>
			<th class="no-sort">Interfaces</th>
			<!--th class="no-sort">Collector</th-->
			<th class="no-sort">Action(s)</th>
		</tr>
	</thead>
	<tbody>
		${collections.hits.map(({_name: name, displayName, collector: {name: collectorName}}) => {
		const count = getDocumentCount(name);
		if (count) {
			totalCount += count;
		}
		return `<tr>
			<td>${displayName}</td>
			<td class="right aligned" data-sort-value="${count}">${count}</td>
			<td>${usedInInterfaces(name).join(', ')}</td>
			<!--td>${collectorName}</td-->
			<td>
				<a class="tiny compact ui button" href="${TOOL_PATH}/collections/edit/${name}"><i class="blue edit icon"></i>Edit</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/collections/collect/${name}"><i class="green cloud download icon"></i>Collect</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/collections/collect/${name}?resume=true"><i class="green redo alternate icon"></i>Resume</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/collections/delete/${name}"><i class="red trash alternate outline icon"></i>Delete</a>
			</td>
		</tr>`;}).join('\n')}
	</tbody>
	<tfoot>
		<tr>
			<th></th>
			<th class="right aligned">${totalCount}</th>
			<th></th>
			<!--th></th-->
			<th></th>
		</tr>
	</tfoot>
</table>`,
		messages,
		path,
		status,
		title: 'Collections'
	});
};