import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {getThesauri} from '/lib/enonic/yase/admin/thesauri/getThesauri';



export function listThesauriPage(
	{path} = {},
	{messages, status} = {}
) {
	const thesauri = getThesauri();
	return htmlResponse({
		main: `
<form action="${TOOL_PATH}/thesauri" autocomplete="off" enctype="multipart/form-data" method="POST">
	<fieldset>
		<legend>Import</legend>
		<label>
			<span>Name</span>
			<input accept="text/csv" name="file" type="file">
		</label>
		<select name="thesaurus">
			${thesauri.map(t => `<option value="${t.name}">${t.displayName}</option>`)}
		</select>
		<button type="submit">Import csv</button>
	</fieldset>
</form>
<form action="${TOOL_PATH}/thesauri" autocomplete="off" method="POST">
	<fieldset>
		<legend>Thesaurus</legend>
		<label>
			<span>Name</span>
			<input name="name" type="text"/>
		</label>
		<label>
			<span>Description</span>
			<input name="description" type="text"/>
		</label>
		<button type="submit">Save thesaurus</button>
	</fieldset>
</form>
<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Display name</th>
			<th>Description</th>
			<th>Export</th>
		</tr>
	</thead>
	<tbody>
		${thesauri.map(t => `<tr>
			<td><a href="${TOOL_PATH}/thesauri/${t.name}">${t.name}</a></td>
			<td>${t.displayName}</td>
			<td>${t.description}</td>
			<td><a href="${TOOL_PATH}/thesauri/${t.name}.csv">${t.name}.csv</a></td>
		</tr>`).join('\n')}
	</tbody>
</table>`,
		messages,
		path,
		status,
		title: 'Thesauri'
	});
}
