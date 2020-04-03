import {toStr} from '/lib/util';
import {list as listTasks} from '/lib/xp/task';

import {PRINCIPAL_EXPLORER_READ/*, TASK_COLLECT*/} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {query as queryCollectors} from '/lib/explorer/collector/query';


const TRACE = false;
const DEBUG = false;


export const listCollectors = () => {
	const collectors = queryCollectors({
		connection: connect({
			principals: [PRINCIPAL_EXPLORER_READ]
		})
	});
	TRACE && log.info(`collectors:${toStr(collectors)}`);

	const list = [];
	collectors.hits.forEach(({
		_name: collectorId/*,
		appName,
		collectTaskName*/
	}) => {
		DEBUG && log.info(`collectorId:${toStr(collectorId)}`);
		listTasks({
			name: collectorId
		}).forEach(item => list.push(item));
	});
	DEBUG && log.info(`list:${toStr(list)}`);
	return list;
}
