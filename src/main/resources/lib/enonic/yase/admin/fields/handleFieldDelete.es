//import {toStr} from '/lib/enonic/util';
import {
	BRANCH_ID,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';
import {fieldsPage} from '/lib/enonic/yase/admin/fields/fieldsPage';


export function handleFieldDelete({
	path
}) {
	const relPath = path.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	const fieldName = pathParts[1];
	const connection = connectRepo({
		repoId: REPO_ID,
		branch: BRANCH_ID
	});
	const key = `/fields/${fieldName}`;
	const deleteRes = connection.delete(key);
	//log.info(toStr({deleteRes}));
	return fieldsPage({path}, {
		messages: deleteRes.length
			? [`Field with key:${key} deleted.`]
			: [`Something went wrong when trying to delete field with key:${key}.`],
		status: deleteRes.length ? 200 : 500
	});
}
