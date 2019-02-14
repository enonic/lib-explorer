import {toStr} from '/lib/enonic/util';
import {NT_INTERFACE} from '/lib/enonic/yase/constants';
import {createOrModifyNode} from '/lib/enonic/yase/createOrModifyNode';
import {interfacesPage} from '/lib/enonic/yase/admin/interfaces/interfacesPage';


export function handleInterfacesPost({
	params,
	path: reqPath
}) {
	const {json} = params;
	log.info(toStr({json}));

	const obj = JSON.parse(json);
	log.info(toStr({obj}));

	obj._indexConfig = {default: 'byType'};
	obj._name = obj.name;
	obj._parentPath = '/interfaces';
	obj.displayName = obj.name;
	obj.type = NT_INTERFACE;
	log.info(toStr({obj}));

	const node = createOrModifyNode(obj);

	return interfacesPage({
		path: reqPath
	}, {
		messages: node
			? [`Interface ${obj.name} saved.`]
			: [`Something went wrong when saving interface ${obj.name}!`],
		statue: node ? 200 : 500
	});
} // function handleInterfacesPost
