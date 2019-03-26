import {listCollectors} from '/lib/enonic/yase/collector/listCollectors';

import {RT_JSON} from '/lib/enonic/yase/constants';


const {nanoTime} = Java.type('java.lang.System');


export const get = () => ({
	contentType: RT_JSON,
	body: listCollectors().map(task => {
		task.progress.info = JSON.parse(task.progress.info);
		if (!task.progress.info.currentTime) {
			task.progress.info.currentTime = nanoTime() / 1000000;
		}
		if (!task.progress.info.startTime) {
			task.progress.info.startTime = task.progress.info.currentTime;
		}
		return task;
	})
});
