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
		comment,
		displayName,
		description,
		indexConfig,
		key,
		...rest
	}) => {
		const indexConfigStr = indexConfig === 'custom'
			? [
				'decideByType',
				'enabled',
				'nGram',
				'fulltext',
				'includeInAllText',
				'path'
			].map(k => rest[k] ? k : '').filter(x => x).join(', ') // eslint-disable-line no-confusing-arrow
			: indexConfig;
		return `<tr>
		<td>${displayName}</td>
		<td>${key}</td>
		<td>${description}</td>
		<td>${indexConfigStr}</td>
		<td>${comment}</td>
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
			<th>Comment</th>
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
