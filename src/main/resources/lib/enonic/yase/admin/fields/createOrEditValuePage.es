import {toStr} from '/lib/enonic/util';
import {
	BRANCH_ID,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';
import {fieldValueFormHtml} from '/lib/enonic/yase/admin/fields/fieldValueFormHtml';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export function createOrEditValuePage({
	path: reqPath
}) {
	const relPath = reqPath.replace(TOOL_PATH, ''); //log.info(toStr({relPath}));
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	const fieldName = pathParts[1]; //log.info(toStr({fieldName}));
	const action = pathParts[2];
	const valueName = pathParts[3];
	const valueAction = pathParts[4];
	log.info(toStr({fieldName, action, valueName, valueAction}));

	if(valueName) {
		const connection = connectRepo({
			repoId: REPO_ID,
			branch: BRANCH_ID
		});
		const nodePath = `/fields/${fieldName}/${valueName}`;
		const node = connection.get(nodePath);
		const {displayName} = node;
		return htmlResponse({
			main: fieldValueFormHtml({
				field: fieldName,
				action: `${TOOL_PATH}/fields/${fieldName}/values/${valueName}/update`,
				displayName,
				value: valueName
			})
		});
	}

	return htmlResponse({
		main: fieldValueFormHtml({
			field: fieldName
		})
	});
} // createOrEditValuePage
