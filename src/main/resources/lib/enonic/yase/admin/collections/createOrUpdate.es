//import {toStr} from '/lib/enonic/util';
import {
	NT_COLLECTION,
	PRINCIPAL_YASE_WRITE,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {createOrModify} from '/lib/enonic/yase/node/createOrModify';
import {getCollectors, reschedule} from '/lib/enonic/yase/collection/reschedule';


export const createOrUpdate = ({
	params//,
	//path
}) => {
	/*log.info(toStr({
		params,
		path
	}));*/

	const {json} = params;
	//log.info(toStr({json}));

	const obj = JSON.parse(json);
	//log.info(toStr({obj}));

	const connection = connect({
		principals: [PRINCIPAL_YASE_WRITE]
	});

	const parentPath = '/collections';
	const oldNode = connection.get(`${parentPath}/${obj.name}`);

	obj.__connection = connection; // eslint-disable-line no-underscore-dangle
	obj._indexConfig = {default: 'byType'};
	obj._name = obj.name;
	obj._parentPath = parentPath;
	obj.displayName = obj.name;
	obj.type = NT_COLLECTION;
	//log.info(toStr({obj}));

	let status = 200;
	const messages = [];
	const node = createOrModify(obj);
	if(node) {
		messages.push(`Collection ${obj.name} saved.`);
		const collectors = getCollectors({connection});
		//log.info(toStr({collectors}));
		reschedule({
			collectors,
			node,
			oldNode
		});
	} else {
		messages.push(`Something went wrong when saving collection ${obj.name}!`);
		status = 500;
	}
	return {
		redirect: `${TOOL_PATH}/collections/list?${
			messages.map(m => `messages=${encodeURIComponent(m)}`).join('&')
		}&status=${status}`
	}
};
