//import {toStr} from '/lib/enonic/util';
import {
	NT_COLLECTION,
	PRINCIPAL_YASE_WRITE,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {createOrModify} from '/lib/enonic/yase/node/createOrModify';


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

	obj.__connection = connect({ // eslint-disable-line no-underscore-dangle
		principals: [PRINCIPAL_YASE_WRITE]
	});
	obj._indexConfig = {default: 'byType'};
	obj._name = obj.name;
	obj._parentPath = '/collections';
	obj.displayName = obj.name;
	obj.type = NT_COLLECTION;
	//log.info(toStr({obj}));

	let status = 200;
	const messages = [];
	const node = createOrModify(obj);
	if(node) {
		messages.push(`Collection ${obj.name} saved.`);
	} else {
		messages.push(`Something went wrong when saving collection ${obj.name}!`);
		status = 500;
	}
	return {
		redirect: `${TOOL_PATH}/collections/list?${
			messages.map(m => `messages=${m}`).join('&')
		}&status=${status}`
	}
};
