import {
	BRANCH_ID,
	PRINCIPAL_YASE_READ,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {tagFormHtml} from '/lib/enonic/yase/admin/tags/tagFormHtml';


export function newOrEdit({
	path: reqPath,
	params: {
		id
	}
}) {
	if(!id) {
		return htmlResponse({
			messages: ['Missing parameter id!'],
			status: 400
		});
	}
	const relPath = reqPath.replace(TOOL_PATH, ''); //log.info(toStr({relPath}));
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	const tagName = pathParts[1]; //log.info(toStr({fieldName}));
	const connection = connect({
		repoId: REPO_ID,
		branch: BRANCH_ID,
		principals: [PRINCIPAL_YASE_READ]
	});

	const node = connection.get(id);
	//log.info(toStr({node}));

	const {displayName, field, tag} = node;
	//log.info(toStr({displayName, field, tag}));

	return htmlResponse({
		main: tagFormHtml({
			connection,
			displayName,
			field,
			tag
		}),
		path: reqPath,
		title: `Edit tag ${displayName} `
	});
}
