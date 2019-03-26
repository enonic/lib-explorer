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
			<a class="tiny compact ui button" href="${TOOL_PATH}/fields/${name}"><i class="blue edit icon"></i>Edit</a>
			<a class="tiny compact ui button" href="${TOOL_PATH}/fields/${name}/delete"><i class="red trash alternate outline icon"></i>Delete</a>
		</td>
	</tr>`;
	}).join('\n');
	return htmlResponse({
		main: `${fieldFormHtml()}
<table class="compact ui sortable selectable celled striped table">
	<thead>
		<tr>
			<th class="sorted ascending">Key</th>
			<th>Display name</th>
			<th>Type</th>
			<!--th>IndexConfig</th-->
			<th>Values</th>
			<th class="no-sort">Actions</th>
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
