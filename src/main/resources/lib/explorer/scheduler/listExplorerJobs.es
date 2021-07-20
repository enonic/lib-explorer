//import {toStr} from '@enonic/js-utils';

import {list as listJobs} from '/lib/xp/scheduler';


export function listExplorerJobs() {
	const jobList = listJobs();
	//log.info(`jobList:${toStr(jobList)}`);
	const explorerJobsList = jobList.filter(({descriptor}) => descriptor.startsWith('com.enonic.app.explorer'));
	//log.info(`explorerJobsList:${toStr(explorerJobsList)}`);
	return explorerJobsList;
}
