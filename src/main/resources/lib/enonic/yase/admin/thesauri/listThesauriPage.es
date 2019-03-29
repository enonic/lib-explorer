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
<form
	action="${TOOL_PATH}/thesauri"
	autocomplete="off"
	class="ui form"
	method="POST"
	style="width: 100%;"
>
	<div class="ui header">Thesaurus</div>
	<div class="grouped fields">
		<div class="field">
			<label>Name</label>
			<input name="name" type="text"/>
		</div>
		<div class="field">
			<label>Description</label>
			<input name="description" type="text"/>
		</div>
		<div class="field">
			<button class="ui button" type="submit"><i class="green plus icon"></i> New thesaurus</button>
		</div>
	</div>
</form>

<table class="collapsing compact ui sortable selectable celled striped table">
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
</table>

<form
	action="${TOOL_PATH}/thesauri"
	autocomplete="off"
	class="ui form"
	enctype="multipart/form-data"
	method="POST"
	style="width: 100%;"
>
	<div class="ui header">Import</div>
	<div class="grouped fields">
		<div class="field">
			<label>Name</label>
			<input accept="text/csv" name="file" type="file">
		</div>
		<div class="field">
			<select class="ui dropdown" name="thesaurus">
				${thesauri.map(t => `<option value="${t.name}">${t.displayName}</option>`)}
			</select>
		</div>
		<div class="field">
			<button class="ui button" type="submit"><i class="blue download icon"></i> Import csv</button>
		</div>
	</div>
</form>
`,
		messages,
		path,
		status,
		title: 'Thesauri'
	});
}
