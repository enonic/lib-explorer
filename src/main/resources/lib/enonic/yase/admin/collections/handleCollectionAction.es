import {parse as parseCookie} from 'cookie';

import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';
import {list as listTasks, submitNamed} from '/lib/xp/task';
import {request as httpClientRequest} from '/lib/http-client';
import {serviceUrl} from '/lib/xp/portal';

import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {getCollection} from '/lib/enonic/yase/admin/collections/getCollection';


const COLLECT_TASK_NAME = 'com.enonic.app.yase:collect';


function getTasksWithPropertyValue({
	property = 'name',
	value,
	name = COLLECT_TASK_NAME,
	state
}) {
	const tasks = listTasks({
		name,
		state
	}); //log.info(toStr({rootTasks}));

	const tasksWithPropertyValue = tasks.map((t) => {
		if (t.progress.info) {
			t.progress.info = JSON.parse(t.progress.info); // eslint-disable-line no-param-reassign
		} /*else {
			t.progress.info = {}; // eslint-disable-line no-param-reassign
		}*/
		return t;
	}).filter(t => t.progress.info && t.progress.info[property] === value); //log.info(toStr({tasksWithPropertyValue}));
	return tasksWithPropertyValue;
}


export const handleCollectionAction = ({
	path,
	method,
	headers: {
		Cookie: cookieHeader
	}
}) => {
	//log.info(toStr({path, method, cookieHeader}));

	const cookies = parseCookie(cookieHeader);
	//log.info(toStr({cookies}));

	const sessionId = cookies.JSESSIONID;
	//log.info(toStr({sessionId}));

	const relPath = path.replace(TOOL_PATH, '');

	const pathParts = relPath.match(/[^/]+/g);
	const collectionName = pathParts[1];
	const action = pathParts[2];
	//log.info(toStr({collectionName, action}));

	if(action === 'collect' && method === 'POST') {
		const runningTasksWithName = getTasksWithPropertyValue({value: collectionName, state: 'RUNNING'});
		if (runningTasksWithName.length) {
			const alreadyRunningtaskId = runningTasksWithName[0].id;
			//log.info(toStr({alreadyRunningtaskId}));
		} else {
			const collectionNode = getCollection({name: collectionName});
			//log.info(toStr({collectionNode}));

			const {
				_name: name,
				collector: {
					config
				}
			} = collectionNode;
			//log.info(toStr({name, config}));

			const configJson = JSON.stringify(config);
			//log.info(toStr({configJson}));

			/*const url = serviceUrl({
				service: 'collect',
				application: 'com.enonic.yase.collector.surgeon',
				params: {
					name,
					configJson
				},
				type: 'absolute'
			});
			log.info(toStr({url}));

			const reqParams = {
				headers: {
					Cookie: `JSESSIONID=${sessionId}`
				},
				url
				//contentType: 'application/json'
			};
			log.info(toStr({reqParams}));

			const response = httpClientRequest(reqParams);
			log.info(toStr({response}));*/

			const submitNamedParams = {
				name: COLLECT_TASK_NAME,
				config: {
					name,
					configJson
				}
			};
			//log.info(toStr({submitNamedParams}));

			const taskId = submitNamed(submitNamedParams);
			//log.info(toStr({taskId}));
		}
	}
}; // handleCollectionAction
