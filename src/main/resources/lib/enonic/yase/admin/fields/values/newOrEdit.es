//import {toStr} from '/lib/enonic/util';
import {
	BRANCH_ID,
	PRINCIPAL_YASE_READ,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {fieldValueFormHtml} from '/lib/enonic/yase/admin/fields/values/fieldValueFormHtml';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export function newOrEdit({
	path
}) {
	//log.info(toStr({path}));
	const relPath = path.replace(TOOL_PATH, ''); //log.info(toStr({relPath}));
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	const action = pathParts[1];
	const fieldName = pathParts[2];
	const valueAction = pathParts[3];
	const valueName = pathParts[4];
	//log.info(toStr({action, fieldName, valueAction, valueName}));

	if(valueName) {
		const connection = connect({
			repoId: REPO_ID,
			branch: BRANCH_ID,
			principals: [PRINCIPAL_YASE_READ]
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
			}),
			path
		});
	}

	return htmlResponse({
		main: fieldValueFormHtml({
			field: fieldName
		}),
		path
	});
} // newOrEdit
