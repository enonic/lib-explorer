import {list as listTasks} from '/lib/xp/task';


import {TASK_COLLECT} from '/lib/enonic/yase/constants';


export function getTasksWithPropertyValue({
	property = 'name',
	value,
	name = TASK_COLLECT,
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
