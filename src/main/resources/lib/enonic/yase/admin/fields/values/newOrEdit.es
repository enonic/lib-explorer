import {toStr} from '/lib/enonic/util';
import {
	BRANCH_ID,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {fieldValueFormHtml} from '/lib/enonic/yase/admin/fields/values/fieldValueFormHtml';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export function newOrEdit({
	path: reqPath
}) {
	const relPath = reqPath.replace(TOOL_PATH, ''); //log.info(toStr({relPath}));
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	const action = pathParts[1];
	const fieldName = pathParts[2]; //log.info(toStr({fieldName}));
	const valueAction = pathParts[3];
	const valueName = pathParts[4];
	log.info(toStr({fieldName, action, valueName, valueAction}));

	if(valueName) {
		const connection = connect({
			repoId: REPO_ID,
			branch: BRANCH_ID
		});
		const nodePath = `/fields/${fieldName}/${valueName}`;
		const node = connection.get(nodePath);
		const {displayName} = node;
		return htmlResponse({
			main: fieldValueFormHtml({
				field: fieldName,
				//action: `${TOOL_PATH}/fields/values/${fieldName}/update/${valueName}`,
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
} // newOrEdit
