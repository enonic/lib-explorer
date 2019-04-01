//import {toStr} from '/lib/enonic/util';
import {dlv} from '/lib/enonic/util/object';
import {
	BRANCH_ID,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {fieldFormHtml} from '/lib/enonic/yase/admin/fields/fieldFormHtml';
import {fieldValueFormHtml} from '/lib/enonic/yase/admin/fields/values/fieldValueFormHtml';
import {getFieldValues} from '/lib/enonic/yase/admin/fields/getFieldValues';


export function newOrEdit({
	path: reqPath/*,
	params: {
		id,
		name
	}*/
}, {
	messages = [],
	status = 200
} = {}) {
	//log.info(toStr({reqPath}));
	const relPath = reqPath.replace(TOOL_PATH, ''); //log.info(toStr({relPath}));
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	const fieldName = pathParts[2]; //log.info(toStr({fieldName}));

	if (fieldName) {
		const connection = connect({
			repoId: REPO_ID,
			branch: BRANCH_ID
		});
		const path = `/fields/${fieldName}`;
		//log.info(toStr({path}));

		const node = connection.get(path);
		//log.info(toStr({node}));

		const {description, displayName, indexConfig, key} = node;
		//log.info(toStr({description, displayName, key, indexConfig}));

		const fieldForm = fieldFormHtml({
			//action: `${TOOL_PATH}/fields/update/${fieldName}`,
			description,
			decideByType: dlv(indexConfig, 'decideByType', true),
			displayName,
			enabled: dlv(indexConfig, 'enabled', true),
			fulltext: dlv(indexConfig, 'fulltext', true),
			includeInAllText: dlv(indexConfig, 'includeInAllText', true),
			key,
			ngram: dlv(indexConfig, 'ngram', true),
			path: dlv(indexConfig, 'path', false)
			/*,
			instruction*/
		});

		const values = getFieldValues({field: fieldName}).hits;
		//log.info(toStr({values}));

		const valueForm = fieldValueFormHtml({
			field: fieldName
		});

		return htmlResponse({
			main: `${fieldForm}
<table class="collapsing compact ui sortable selectable celled striped table">
	<thead>
		<tr>
			<th class="sorted ascending">Value</th>
			<th>Display name</th>
			<th class="no-sort">Actions</th>
		</tr>
	</thead>
	<tbody>
		${values.map(({_name: value, displayName: vDN}) => `<tr>
			<td>${value}</td>
			<td>${vDN}</td>
			<td>
				<a class="tiny compact ui button" href="${TOOL_PATH}/fields/${fieldName}/values/${value}/edit"><i class="blue edit icon"></i>Edit</a>
				<form action="${TOOL_PATH}/fields/${fieldName}/values/${value}/delete" method="post">
					<button class="tiny compact ui button" type="submit"><i class="red trash alternate outline icon"></i>Delete</button>
				</form>
			</td>
		</tr>`).join('')}
	</tbody>
</table>
${valueForm}`,
			messages,
			path: reqPath,
			status,
			title: `Edit field ${displayName} `
		});
	}

	return htmlResponse({
		main: fieldFormHtml(),
		messages,
		path: reqPath,
		status,
		title: 'Create field'
	});
} // newOrEdit
