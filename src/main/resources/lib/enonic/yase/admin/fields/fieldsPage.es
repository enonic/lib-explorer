import {toStr} from '/lib/enonic/util';

import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {fieldFormHtml} from '/lib/enonic/yase/admin/fields/fieldFormHtml';
import {getFields} from '/lib/enonic/yase/admin/fields/getFields';
import {getFieldValues} from '/lib/enonic/yase/admin/fields/getFieldValues';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export function fieldsPage({
	path
}, {
	messages,
	status
} = {}) {
	const fieldRows = getFields().hits.map(({
		_id: id,
		_name: name,
		displayName,
		//description,
		fieldType,
		indexConfig,
		key
	}) => {
		return `<tr>
		<td>${key}</td>
		<td>${displayName}</td>
		<td>${fieldType}</td>
		<!--td>${toStr(indexConfig)}</td-->
		<td>${getFieldValues({field: name}).hits.map(({displayName: vN}) => vN).join(', ')}</td>
		<td>
			<form action="${TOOL_PATH}/fields/${name}" method="get">
				<button type="submit">Edit</button>
			</form>
			<form action="${TOOL_PATH}/fields/${name}/delete" method="post">
				<button type="submit">Delete</button>
			</form>
		</td>
	</tr>`;
	}).join('\n');
	return htmlResponse({
		main: `${fieldFormHtml()}
<table>
	<thead>
		<tr>
			<th>Key</th>
			<th>Display name</th>
			<th>Type</th>
			<!--th>IndexConfig</th-->
			<th>Values</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		${fieldRows}
	</tbody>
</table>`,
		messages,
		path,
		status,
		title: 'Fields'
	});
}
