import {toStr} from '/lib/enonic/util';
import {fieldFormHtml} from '/lib/enonic/yase/admin/fields/fieldFormHtml';
import {getFields} from '/lib/enonic/yase/admin/fields/getFields';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export function fieldsPage({
	path
}, {
	messages,
	status
} = {}) {
	const fieldRows = getFields().hits.map(({
		displayName,
		description,
		indexConfig,
		key
	}) => {
		return `<tr>
		<td>${displayName}</td>
		<td>${key}</td>
		<td>${description}</td>
		<td>${toStr(indexConfig)}</td>
	</tr>`;
	}).join('\n');
	return htmlResponse({
		main: `${fieldFormHtml()}
<table>
	<thead>
		<tr>
			<th>Display name</th>
			<th>Key</th>
			<th>Description</th>
			<th>IndexConfig</th>
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
