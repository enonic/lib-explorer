//import {toStr} from '/lib/enonic/util';
import {
	PRINCIPAL_YASE_READ,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {menu} from '/lib/enonic/yase/admin/thesauri/menu';
import {connect} from '/lib/enonic/yase/repo/connect';
import {query as getThesauri} from '/lib/enonic/yase/thesaurus/query';


export function list({
	params: {
		messages,
		status
	},
	path
}) {
	const connection = connect({
		principals: [PRINCIPAL_YASE_READ]
	});
	const thesauri = getThesauri({connection}).hits;
	return htmlResponse({
		main: `${menu({path})}
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
				<a class="tiny compact ui button" href="${TOOL_PATH}/thesauri/edit/${t.name}"><i class="blue edit icon"></i> Edit</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/thesauri/delete/${t.name}"><i class="red trash alternate outline icon"></i>Delete</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/thesauri/import/${t.name}"><i class="blue upload icon"></i>Import</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/thesauri/export/${t.name}.csv"><i class="blue download icon"></i> ${t.name}.csv</a>
			</td>
		</tr>`).join('\n')}
	</tbody>
</table>
`,
		messages,
		path,
		status,
		title: 'Thesauri'
	});
}
