//import {toStr} from '/lib/enonic/util';
import {
	BRANCH_ID,
	NT_INTERFACE,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {createOrModify} from '/lib/enonic/yase/node/createOrModify';
import {interfacesPage} from '/lib/enonic/yase/admin/interfaces/interfacesPage';


export function handleInterfacesPost({
	params,
	path: reqPath
}) {
	const relPath = reqPath.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	const interfaceName = pathParts[1];
	const action = pathParts[2];

	if (action === 'delete') {
		const messages = [];
		let status = 200;
		const {typedInterfaceName} = params;
		if (!typedInterfaceName) {
			messages.push('Missing required parameter "typedInterfaceName"!');
			status = 400;
		} else if (typedInterfaceName !== interfaceName) {
			messages.push(`Typed interface name: "${typedInterfaceName}" doesn't match actual interface name: "${interfaceName}"!`);
			status = 400;
		} else {
			const connection = connect({
				repoId: REPO_ID,
				branch: BRANCH_ID
			});
			const nodePath = `/interfaces/${interfaceName}`;
			const deleteRes = connection.delete(nodePath);
			if(deleteRes) {
				messages.push(`Interface with path:${nodePath} deleted.`)
			} else {
				messages.push(`Something went wrong when trying to delete interface with path:${nodePath}.`)
				status = 500;
			}
		}
		return interfacesPage({path: reqPath}, {messages, status});
	} // if action === 'delete'

	const {json} = params;
	//log.info(toStr({json}));

	const obj = JSON.parse(json);
	//log.info(toStr({obj}));

	obj._indexConfig = {default: 'byType'};
	obj._name = obj.name;
	obj._parentPath = '/interfaces';
	obj.displayName = obj.name;
	obj.type = NT_INTERFACE;
	//log.info(toStr({obj}));

	const node = createOrModify(obj);

	return interfacesPage({
		path: reqPath
	}, {
		messages: node
			? [`Interface ${obj.name} saved.`]
			: [`Something went wrong when saving interface ${obj.name}!`],
		status: node ? 200 : 500
	});

} // function handleInterfacesPost
