//import {list} from '/lib/enonic/yase/admin/collections/list';


export const handleDelete = ({
	path,
	params: {
		typedCollectionName
	}
}) => {
	const relPath = path.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	const collectionName = pathParts[1];

	const messages = [];
	let status = 200;
	if (!typedCollectionName) {
		messages.push('Missing required parameter "typedCollectionName"!');
		status = 400;
	} else if (typedCollectionName !== collectionName) {
		messages.push(`Typed collection name: "${typedCollectionName}" doesn't match actual collection name: "${collectionName}"!`);
		status = 400;
	} else {
		const connection = connectRepo({
			repoId: REPO_ID,
			branch: BRANCH_ID
		});
		const nodePath = `/collections/${collectionName}`;
		const deleteRes = connection.delete(nodePath);
		if(deleteRes) {
			messages.push(`Collection with path:${nodePath} deleted.`)
		} else {
			messages.push(`Something went wrong when trying to delete collection with path:${nodePath}.`)
			status = 500;
		}
	}
	return {
		redirect: `${TOOL_PATH}/collections/delete/${name}?${
			messages.map(m => `messages=${m}`).join('&')
		}&status=${status}`
	}
	/*return list({path}, {
		messages,
		status
	});*/
} // handleDelete
