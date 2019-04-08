//import {toStr} from '/lib/enonic/util';


import {
	PRINCIPAL_YASE_READ,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {getTags} from '/lib/enonic/yase/admin/tags/getTags';
import {tagFormHtml} from '/lib/enonic/yase/admin/tags/tagFormHtml';
import {connect} from '/lib/enonic/yase/repo/connect';


export function list({
	params: {
		_parentPath = '/tags',
		messages,
		status
	} = {},
	path
}) {
	const connection = connect({principals: PRINCIPAL_YASE_READ});
	const tagRows = getTags({connection}).hits.map(({
		_id: id,
		_name: name,
		//_path,
		displayName,
		field,
		tag
	}) => {
		//const tagPath = _path.replace(/^\/tags\//, '');
		return `<tr>
		<td>${field}</td>
		<td>${tag}</td>
		<td>${displayName}</td>
		<td>
			<form action="${TOOL_PATH}/tags/${id}" method="get">
				<input name="id" type="hidden" value="${id}">
				<button type="submit">Edit</button>
			</form>
			<form action="${TOOL_PATH}/tags/${id}/delete" method="post">
				<input name="id" type="hidden" value="${id}">
				<input name="operation" type="hidden" value="DELETE">
				<button type="submit">Delete</button>
			</form>
		</td>
	</tr>`;
	}).join('\n');

	return htmlResponse({
		main: `${tagFormHtml({connection})}
<table>
	<thead>
		<tr>
			<th>Field</th>
			<th>Tag</th>
			<th>Display name</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		${tagRows}
	</tbody>
	</table>`,
		messages,
		path,
		status,
		title: 'Tags'
	});
}
