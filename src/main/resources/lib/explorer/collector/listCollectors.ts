import type {Task} from '@enonic-types/lib-explorer';


//import {toStr} from '@enonic/js-utils';
//@ts-ignore
import {list as listTasks} from '/lib/xp/task' /*as {
	list :(
		name :string
	) => Array<Task>
};*/
import {list as getInstalledCollectorList} from '/lib/explorer/collector/list';


export const listCollectors = () => {
	//log.warning(`/lib/explorer/collector/listCollectors is deprecated. Use /lib/explorer/collector/list instead.`); // TODO throw error in lib-explorer-5.0.0
	const collectors = getInstalledCollectorList()
	//log.debug(`collectors:${toStr(collectors)}`);

	const list = [];
	collectors.forEach(({
		//_name: collectorId,
		appName,
		taskName
	}) => {
		const collectorId = `${appName}:${taskName}`;
		//log.debug(`collectorId:${toStr(collectorId)}`);
		listTasks({
			name: collectorId
		}).forEach((item :Task) => list.push(item));
	});
	//log.debug(`list:${toStr(list)}`);
	return list;
};
