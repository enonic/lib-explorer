//import {toStr} from '/lib/enonic/util';
import {
	BRANCH_ID,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';
import {fieldsPage} from '/lib/enonic/yase/admin/fields/fieldsPage';


export function handleFieldDelete({
	path: reqPath
}) {
	const relPath = reqPath.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	const fieldName = pathParts[1];
	const connection = connectRepo({
		repoId: REPO_ID,
		branch: BRANCH_ID
	});
	const path = `/fields/${fieldName}`;
	const deleteRes = connection.delete(path);
	//log.info(toStr({deleteRes}));
	return fieldsPage({path: reqPath}, {
		messages: deleteRes.length
			? [`Field with path:${path} deleted.`]
			: [`Something went wrong when trying to delete field with path:${path}.`],
		status: deleteRes.length ? 200 : 500
	});
}
