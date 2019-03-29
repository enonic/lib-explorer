import {toStr} from '/lib/enonic/util';
import {RT_JSON} from '/lib/enonic/yase/constants';
import {listCollectors} from '/lib/enonic/yase/collector/listCollectors';
import {currentTimeMillis} from '/lib/enonic/yase/time/currentTimeMillis';


export const get = () => ({
	contentType: RT_JSON,
	body: listCollectors().map(task => {
		task.progress.info = JSON.parse(task.progress.info);
		//log.info(toStr({task}));
		if (!task.progress.info.currentTime) {
			log.info('Setting new currentTime');
			task.progress.info.currentTime = currentTimeMillis();
		}
		if (!task.progress.info.startTime) {
			log.info('Setting new startTime');
			task.progress.info.startTime = task.progress.info.currentTime;
		}
		return task;
	})
});
