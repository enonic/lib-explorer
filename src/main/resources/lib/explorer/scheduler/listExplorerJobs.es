//import {toStr} from '/lib/util';
import {list as listJobs} from '/lib/xp/scheduler';


export function listExplorerJobs() {
	const explorerJobsList = listJobs().filter(({descriptor}) => descriptor.startsWith('com.enonic.app.explorer:'));
	//log.info(`explorerJobsList:${toStr(explorerJobsList)}`);
	return explorerJobsList;
}
