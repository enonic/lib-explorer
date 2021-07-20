//import {toStr} from '@enonic/js-utils';

import {list as listTasks} from '/lib/xp/task';

import {PRINCIPAL_EXPLORER_READ/*, TASK_COLLECT*/} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {query as queryCollectors} from '/lib/explorer/collector/query';


export const listCollectors = () => {
	//log.warning(`/lib/explorer/collector/listCollectors is deprecated. Use /lib/explorer/collector/list instead.`);
	const collectors = queryCollectors({
		connection: connect({
			principals: [PRINCIPAL_EXPLORER_READ]
		})
	});
	//log.debug(`collectors:${toStr(collectors)}`);

	const list = [];
	collectors.hits.forEach(({
		//_name: collectorId,
		appName,
		collectTaskName
	}) => {
		const collectorId = `${appName}:${collectTaskName}`;
		//log.debug(`collectorId:${toStr(collectorId)}`);
		listTasks({
			name: collectorId
		}).forEach(item => list.push(item));
	});
	//log.debug(`list:${toStr(list)}`);
	return list;
};
