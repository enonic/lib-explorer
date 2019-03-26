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
		main: `<table class="compact ui sortable selectable celled striped table">
	<thead>
		<tr>
			<th class="collapsing sorted ascending">Name</th>
			<th class="collapsing">Documents</th>
			<th class="collapsing no-sort">Interfaces</th>
			<th class="collapsing no-sort">Collector</th>
			<th class="collapsing no-sort">Action(s)</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		${collections.hits.map(({_name: name, displayName, collector: {name: collectorName}}) => {
		const count = getDocumentCount(name);
		if (count) {
			totalCount += count;
		}
		return `<tr>
			<td class="collapsing">${displayName}</td>
			<td class="collapsing right aligned" data-sort-value="${count}">${count}</td>
			<td class="collapsing">${usedInInterfaces(name).join(', ')}</td>
			<td class="collapsing">${collectorName}</td>
			<td class="collapsing">
				<a class="tiny compact ui button" href="${TOOL_PATH}/collections/${name}"><i class="blue edit icon"></i>Edit</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/collections/${name}/collect"><i class="green cloud download icon"></i>Collect</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/collections/${name}/collect?resume=true"><i class="green redo alternate icon"></i>Resume</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/collections/${name}/delete"><i class="red trash alternate outline icon"></i>Delete</a>
			</td>
			<td data-sort-value="10">
				<div class="ui active progress" data-value="10" data-total="20" data-percent="50">
  					<div class="bar">
    					<div class="progress"></div>
  					</div>
  					<div class="label">Processing...</div>
				</div>
			</td>
		</tr>`;}).join('\n')}
	</tbody>
	<tfoot>
		<tr>
			<th><a class="tiny compact ui button" href="${TOOL_PATH}/collections/createform"><i class="green plus icon"></i>New collection</a></th>
			<th class="collapsing right aligned">${totalCount}</th>
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
