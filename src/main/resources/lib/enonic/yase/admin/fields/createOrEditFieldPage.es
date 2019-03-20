import {toStr} from '/lib/enonic/util';
import {dlv} from '/lib/enonic/util/object';
import {
	BRANCH_ID,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {fieldFormHtml} from '/lib/enonic/yase/admin/fields/fieldFormHtml';
import {fieldValueFormHtml} from '/lib/enonic/yase/admin/fields/fieldValueFormHtml';
import {getFieldValues} from '/lib/enonic/yase/admin/fields/getFieldValues';


export function createOrEditFieldPage({
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
	const fieldName = pathParts[1]; //log.info(toStr({fieldName}));

	if (fieldName) {
		const connection = connectRepo({
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
			action: `${TOOL_PATH}/fields/${fieldName}`,
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
		log.info(toStr({values}));

		const valueForm = fieldValueFormHtml({
			field: fieldName
		});

		return htmlResponse({
			main: `${fieldForm}
<table>
	<thead>
		<tr>
			<th>Value</th>
			<th>Display name</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		${values.map(({_name: value, displayName: vDN}) => `<tr>
			<td>${value}</td>
			<td>${vDN}</td>
			<td>
				<form action="${TOOL_PATH}/fields/${fieldName}/values/${value}/edit" method="get">
					<button type="submit">Edit</button>
				</form>
				<form action="${TOOL_PATH}/fields/${fieldName}/values/${value}/delete" method="post">
					<button type="submit">Delete</button>
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
} // createOrEditFieldPage
