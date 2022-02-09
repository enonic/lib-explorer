//import type {Collector} from '/lib/explorer-typescript/collector/types.d';
import type {Task} from '/lib/explorer-typescript/task/types.d';

//import {toStr} from '@enonic/js-utils';

//@ts-ignore
import {list as listTasks} from '/lib/xp/task' /*as {
	list :(
		name :string
	) => Array<Task>
};*/

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
		}).forEach((item :Task) => list.push(item));
	});
	//log.debug(`list:${toStr(list)}`);
	return list;
};
