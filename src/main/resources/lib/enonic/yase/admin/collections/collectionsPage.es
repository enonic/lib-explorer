//import {toStr} from '/lib/enonic/util';

import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {getDocumentCount} from '/lib/enonic/yase/admin/collections/getDocumentCount';
import {queryCollections} from '/lib/enonic/yase/admin/collections/queryCollections';
import {usedInInterfaces} from '/lib/enonic/yase/admin/collections/usedInInterfaces';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export const collectionsPage = ({
	path
}, {
	messages,
	status
} = {}) => {
	const collections = queryCollections();
	let totalCount = 0;
	//log.info(toStr({collections}));
	return htmlResponse({
		main: `<table class="collapsing compact ui sortable selectable celled striped table">
	<thead>
		<tr>
			<th class="sorted ascending">Name</th>
			<th>Documents</th>
			<th class="no-sort">Interfaces</th>
			<th class="no-sort">Collector</th>
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
			<td>${collectorName}</td>
			<td>
				<a class="tiny compact ui button" href="${TOOL_PATH}/collections/${name}"><i class="blue edit icon"></i>Edit</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/collections/${name}/collect"><i class="green cloud download icon"></i>Collect</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/collections/${name}/collect?resume=true"><i class="green redo alternate icon"></i>Resume</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/collections/${name}/delete"><i class="red trash alternate outline icon"></i>Delete</a>
			</td>
		</tr>`;}).join('\n')}
	</tbody>
	<tfoot>
		<tr>
			<th><a class="tiny compact ui button" href="${TOOL_PATH}/collections/createform"><i class="green plus icon"></i>New collection</a></th>
			<th class="right aligned">${totalCount}</th>
			<th></th>
			<th></th>
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
