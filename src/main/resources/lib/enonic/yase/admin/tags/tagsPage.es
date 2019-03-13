//import {toStr} from '/lib/enonic/util';


import {
	TOOL_PATH/*,
	PATH_TAG*/
} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {getFields} from '/lib/enonic/yase/admin/fields/getFields';
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
	const tagRows = getTags().hits.map(({
		_id,
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
			<form action="${TOOL_PATH}/tags/${_id}" method="get">
				<button type="submit">Edit</button>
			</form>
			<form action="${TOOL_PATH}/tags/${_id}/delete" method="post">
				<button type="submit">Delete</button>
			</form>
		</td>
	</tr>`;
	}).join('\n');

	return htmlResponse({
		main: `<form action="${TOOL_PATH}/tags" autocomplete="off" method="POST">
	<h2>New tag</h2>
	<label>
		<span>Field</span>
		<!--input id="_parentPath" name="_parentPath" readonly tabIndex="-1" type="text" value="${_parentPath}"/-->
		<select name="field">
			${getFields().hits.map(({_name, displayName}) => `<option value="${_name}">${displayName}</option>`)}
		</select>
	</label>

	<label>
		<span>Tag</span>
		<input name="tag" type="text"/>
		<p class="help-text">Used to mark scraped documents and during aggregation. Keep in mind it's case sensitive.</p>
	</label>

	<label>
		<span>Display name</span>
		<input name="displayName" type="text"/>
		<p class="help-text">Used when selecting tags. Could also be used in front-end facets.</p>
	</label>

	<button type="submit">Add tag</button>
</form>
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
