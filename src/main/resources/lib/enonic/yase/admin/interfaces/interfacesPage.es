import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {queryInterfaces} from '/lib/enonic/yase/admin/interfaces/queryInterfaces';


export function interfacesPage({
	path
}, {
	messages,
	status
} = {}) {
	const interfaces = queryInterfaces();
	return htmlResponse({
		main: `<table class="collapsing compact ui sortable selectable celled striped table">
	<thead>
		<tr>
			<th class="sorted ascending">Name</th>
			<th class="no-sort">Action(s)</th>
		</tr>
	</thead>
	<tbody>
		${interfaces.hits.map(({_name: name, displayName}) => `<tr>
			<td>${displayName}</td>
			<td>
				<a class="tiny compact ui button" href="${TOOL_PATH}/interfaces/${name}"><i class="blue edit icon"></i>Edit</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/interfaces/${name}/delete"><i class="red trash alternate outline icon"></i>Delete</a>
			</td>
		</tr>`).join('\n')}
	</tbody>
</table><a class="tiny compact ui button" href="${TOOL_PATH}/interfaces/createform"><i class="green plus icon"></i>New interface</a>`,
		messages,
		path,
		status,
		title: 'Interfaces'
	});
} // function interfacesPage
