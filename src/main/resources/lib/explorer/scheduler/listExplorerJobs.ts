import type {CollectorTaskConfig} from '@enonic-types/lib-explorer';

// import {toStr} from '@enonic/js-utils';
import {APP_EXPLORER} from '/lib/explorer/model/2/constants';
import {list as listJobs} from '/lib/xp/scheduler';


export function listExplorerJobs() {
	const jobList = listJobs<CollectorTaskConfig>();
	// log.info(`jobList:${toStr(jobList)}`);
	const explorerJobsList = jobList.filter(({descriptor}) => descriptor.startsWith(APP_EXPLORER));
	// log.info(`explorerJobsList:${toStr(explorerJobsList)}`);
	return explorerJobsList;
}
