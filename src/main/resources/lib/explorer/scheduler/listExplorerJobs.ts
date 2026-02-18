import type { CollectorTaskConfig } from '../types.d';

import { startsWith } from '@enonic/js-utils/string/startsWith';
// import { toStr } from '@enonic/js-utils/value/toStr';
import { list as listJobs } from '/lib/xp/scheduler';
import { APP_EXPLORER } from '/lib/explorer/model/2/constants';


export function listExplorerJobs() {
	const jobList = listJobs<CollectorTaskConfig>();
	// log.info(`jobList:${toStr(jobList)}`);
	const explorerJobsList = jobList.filter(({ descriptor }) => startsWith(descriptor, APP_EXPLORER));
	// log.info(`explorerJobsList:${toStr(explorerJobsList)}`);
	return explorerJobsList;
}
