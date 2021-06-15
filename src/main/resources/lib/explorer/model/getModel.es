import {connect} from '/lib/explorer/repo/connect';
//import {toStr} from '/lib/util';


export function getModel({
	branch,
	context,
	principals,
	repoId,
	connection = connect({
		branch,
		context,
		principals,
		repoId
	})
} = {}) {
	const rootNode = connection.get('/');
	//log.debug(`rootNode:${toStr(rootNode)}`);
	const {model = -1} = rootNode;
	//log.debug(`model:${toStr(model)}`);
	return model;
}
