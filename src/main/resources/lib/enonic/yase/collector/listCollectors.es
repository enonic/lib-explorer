import {list as listTasks} from '/lib/xp/task';


import {TASK_COLLECT} from '/lib/enonic/yase/constants';


export const listCollectors = () => listTasks({
	name: TASK_COLLECT
});
