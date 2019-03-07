//import {toStr} from '/lib/enonic/util';


import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {getTags} from '/lib/enonic/yase/admin/tags/getTags';


export function tagsPage(
	{
		params: {
			_parentPath = '/tags'
		} = {},
		path
	},
	{
		messages,
		status
	} = {}
) {
	const fieldRows = getTags().hits.map(({
		_path,
		displayName
	}) => {
		const tagPath = _path.replace(/^\/tags\//, '');
		return `<tr>
		<td>${tagPath}</td>
		<td>${displayName}</td>
		<td><button onClick="document.getElementById('_parentPath').setAttribute('value', '/tags/${tagPath}')">Create child tag</button></td>
	</tr>`;
	}).join('\n');

	return htmlResponse({
		main: `<form action="${TOOL_PATH}/tags" autocomplete="off" method="POST">
	<fieldset>
		<legend>New tag</legend>
		<label>
			<span>Parent path</span>
			<input id="_parentPath" name="_parentPath" readonly tabIndex="-1" type="text" value="${_parentPath}"/>
		</label>

		<label>
			<span>Name</span>
			<input name="name" type="text"/>
		</label>

		<label>
			<span>Display name</span>
			<input name="displayName" type="text"/>
		</label>

		<button type="submit">Add tag</button>
	</fieldset>
</form>
<table>
	<thead>
		<tr>
			<th>Tag</th>
			<th>Display name</th>
			<th>Action(s)</th>
		</tr>
	</thead>
	<tbody>
		${fieldRows}
	</tbody>
	</table>`,
		messages,
		path,
		status,
		title: 'Tags'
	});
}
