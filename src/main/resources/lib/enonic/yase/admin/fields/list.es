import {toStr} from '/lib/util';

import {
	DEFAULT_FIELDS,
	NO_VALUES_FIELDS,
	PRINCIPAL_YASE_READ,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {fieldFormHtml} from '/lib/enonic/yase/admin/fields/fieldFormHtml';
import {getFields} from '/lib/enonic/yase/admin/fields/getFields';
import {getFieldValues} from '/lib/enonic/yase/admin/fields/getFieldValues';
import {menu} from '/lib/enonic/yase/admin/fields/menu';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {connect} from '/lib/enonic/yase/repo/connect';


export function list({
	params: {
		messages,
		status
	},
	path
}) {
	const connection = connect({principals: PRINCIPAL_YASE_READ});
	const defaultFields = DEFAULT_FIELDS.map(({_name})=>_name);
	const noValuesFields = NO_VALUES_FIELDS.map(({_name})=>_name);
	const fieldRows = getFields({connection}).hits.map(({
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
		<td>${getFieldValues({
		connection,
		field: name
	}).hits.map(({displayName: vN}) => vN).join(', ')}</td>
		<td>
			${noValuesFields.includes(name) ? '' : `
				<a class="tiny compact ui button" href="${TOOL_PATH}/fields/edit/${name}"><i class="blue edit icon"></i>Edit</a>
			`}
			${defaultFields.includes(name) ? '' : `
				<a class="tiny compact ui button" href="${TOOL_PATH}/fields/delete/${name}"><i class="red trash alternate outline icon"></i>Delete</a>
			`}
		</td>
	</tr>`;
	}).join('\n');
	return htmlResponse({
		main: `${menu({path})}
<table class="collapsing compact ui sortable selectable celled striped table">
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
