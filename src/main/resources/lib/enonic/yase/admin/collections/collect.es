//import {parse as parseCookie} from 'cookie';

import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';
import {list as listTasks, submitNamed} from '/lib/xp/task';
import {request as httpClientRequest} from '/lib/http-client';

import {
	PRINCIPAL_YASE_READ,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {get as getCollection} from '/lib/enonic/yase/collection/get';
//import {list} from '/lib/enonic/yase/admin/collections/list';
import {getTasksWithPropertyValue} from '/lib/enonic/yase/task/getTasksWithPropertyValue';


import {TASK_COLLECT} from '/lib/enonic/yase/constants';



export const collect = ({
	path,
	method,
	params: {
		resume
	}
}) => {
	//log.info(toStr({path, method}));

	const relPath = path.replace(TOOL_PATH, '');

	const pathParts = relPath.match(/[^/]+/g);
	const collectionName = pathParts[2];

	const messages = [];
	let status = 200;

	const runningTasksWithName = getTasksWithPropertyValue({value: collectionName, state: 'RUNNING'});
	if (runningTasksWithName.length) {
		const alreadyRunningtaskId = runningTasksWithName[0].id;
		status = 500;
		messages.push(`Already collecting to ${collectionName} under taskId ${alreadyRunningtaskId}!`);
		//log.info(toStr({alreadyRunningtaskId}));
	} else {
		const connection = connect({
			principals: [PRINCIPAL_YASE_READ]
		});
		const collectionNode = getCollection({
			connection,
			name: collectionName
		});
		//log.info(toStr({collectionNode}));

		const {
			_name: name,
			collector: {
				config
			}
		} = collectionNode;
		//log.info(toStr({name, config}));
		if (resume === 'true') {
			config.resume = true;
		}

		const configJson = JSON.stringify(config);
		//log.info(toStr({configJson}));

		const submitNamedParams = {
			name: TASK_COLLECT,
			config: {
				name,
				configJson
			}
		};
		//log.info(toStr({submitNamedParams}));

		const taskId = submitNamed(submitNamedParams);
		messages.push(`Started collecting ${collectionName} with taskId ${taskId}`);
		//log.info(toStr({taskId}));
	}
	return {
		redirect: `${TOOL_PATH}/collections/list?${
			messages.map(m => `messages=${m}`).join('&')
		}&status=${status}`
	}
}; // collect
