import {toStr} from '/lib/enonic/util';
import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {query as getThesauri} from '/lib/enonic/yase/thesaurus/query';
//import {query as querySynonyms} from '/lib/enonic/yase/synonym/query';



export function listThesauriPage(
	{path} = {},
	{messages, status} = {}
) {
	/*const synonyms = querySynonyms({count: 0});
	log.info(toStr({synonyms}));*/

	const thesauri = getThesauri().hits;
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
			<th>Display name</th>
			<th>Synonyms</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		${thesauri.map(t => `<tr>
			<td>${t.displayName}</td>
			<td>${t.synonymsCount}</td>
			<td>
				<a class="tiny compact ui button" href="${TOOL_PATH}/thesauri/${t.name}"><i class="blue edit icon"></i> Edit</a>
				<a class=" tiny compact ui button" href="${TOOL_PATH}/thesauri/${t.name}.csv"><i class="blue download icon"></i> ${t.name}.csv</a>
			</td>
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
			<button class="ui button" type="submit"><i class="green upload icon"></i> Import csv</button>
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
