//import {toStr} from '/lib/enonic/util';
import {
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_YASE_WRITE,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {get as getTask} from '/lib/enonic/yase/task/get';
import {modify as modifyTask} from '/lib/enonic/yase/task/modify';


export function stop({
	path
}) {
	//log.info(toStr({path}));
	const relPath = path.replace(TOOL_PATH, ''); //log.info(toStr({relPath}));
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	const collectionName = pathParts[2]; //log.info(toStr({collectionName}));

	const repoId = `${COLLECTION_REPO_PREFIX}${collectionName}`; //log.info(toStr({repoId}));
	const connection = connect({
		repoId,
		branch: 'master',
		principals: [PRINCIPAL_YASE_WRITE]
	});

	const task = getTask({connection});	//log.info(toStr({task}));
	const {state} = task;

	log.info(`Stopping task with state: ${state} from collecting to ${repoId}`);

	modifyTask({
		connection,
		should: 'STOP',
		state
	});

	const messages = [];
	let status = 200;
	return {
		redirect: `${TOOL_PATH}/collections/status?${
			messages.map(m => `messages=${encodeURIComponent(m)}`).join('&')
		}&status=${status}`
	}
}
