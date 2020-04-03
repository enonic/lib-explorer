//import {toStr} from '/lib/util';
import {list as listTasks} from '/lib/xp/task';


export function getTasksWithPropertyValue({
	property = 'name',
	value,
	state
}) {
	const tasks = listTasks({
		state
	});
	//log.info(`tasks:${toStr(tasks)}`);

	const tasksWithPropertyValue = tasks.map((t) => {
		if (t.progress.info) {
			t.progress.info = JSON.parse(t.progress.info); // eslint-disable-line no-param-reassign
		} /*else {
			t.progress.info = {}; // eslint-disable-line no-param-reassign
		}*/
		return t;
	}).filter(t => t.progress.info && t.progress.info[property] === value);
	//log.info(`tasksWithPropertyValue:${toStr(tasksWithPropertyValue)}`);

	return tasksWithPropertyValue;
}
