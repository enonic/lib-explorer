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
		main: `<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Action(s)</th>
		</tr>
	</thead>
	<tbody>
		${interfaces.hits.map(({_name, displayName}) => `<tr>
			<td>${displayName}</td>
			<td>
				<form action="${TOOL_PATH}/interfaces/${_name}" method="get">
					<button type="submit">Edit</button>
				</form>
				<form action="${TOOL_PATH}/interfaces/${_name}/delete" method="get">
					<button type="submit">Delete</button>
				</form>
			</td>
		</tr>`).join('\n')}
	</tbody>
</table><ul>
			<li><a href="${TOOL_PATH}/interfaces/createform">Create interface</a></li>
		</ul>`,
		messages,
		path,
		status,
		title: 'Interfaces'
	});
} // function interfacesPage
