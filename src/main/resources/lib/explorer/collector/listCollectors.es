//import {toStr} from '/lib/util';
import {list as listTasks} from '/lib/xp/task';

import {PRINCIPAL_YASE_READ/*, TASK_COLLECT*/} from '/lib/explorer/constants';
import {connect} from '/lib/explorer/repo/connect';
import {query as queryCollectors} from '/lib/explorer/collector/query';


export const listCollectors = () => {
	const connection = connect({
		principals: [PRINCIPAL_YASE_READ]
	});
	const list = [];
	queryCollectors({
		connection
	}).hits.forEach(({_name: application, collectTaskName}) => {
		//log.info(toStr({application, collectTaskName}));
		listTasks({
			name: `${application}:${collectTaskName}`//TASK_COLLECT
		}).forEach(item => list.push(item));
	});
	//log.info(toStr({list}));
	return list;
}
