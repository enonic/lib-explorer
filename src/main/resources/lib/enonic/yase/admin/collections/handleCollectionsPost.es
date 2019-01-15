//import {toStr} from '/lib/enonic/util';
import {NT_COLLECTION} from '/lib/enonic/yase/constants';
import {createOrModifyNode} from '/lib/enonic/yase/createOrModifyNode';
import {collectionsPage} from '/lib/enonic/yase/admin/collections/collectionsPage';


export const handleCollectionsPost = ({
	params,
	path: reqPath
}) => {
	/*log.info(toStr({
		params,
		reqPath
	}));*/

	const {json} = params;
	//log.info(toStr({json}));

	const obj = JSON.parse(json);
	//log.info(toStr({obj}));

	obj._indexConfig = {default: 'byType'};
	obj._name = obj.name;
	obj._parentPath = '/collections';
	obj.displayName = obj.name;
	obj.type = NT_COLLECTION;
	//log.info(toStr({obj}));

	const node = createOrModifyNode(obj);
	return collectionsPage({
		path: reqPath
	}, {
		messages: node
			? [`Collection ${obj.name} saved.`]
			: [`Something went wrong when saving collection ${obj.name}!`],
		statue: node ? 200 : 500
	});
};
