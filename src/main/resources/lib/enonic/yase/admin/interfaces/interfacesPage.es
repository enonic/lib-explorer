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
			<td><a href="${TOOL_PATH}/interfaces/${_name}">${displayName}</a></td>
			<td>
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
