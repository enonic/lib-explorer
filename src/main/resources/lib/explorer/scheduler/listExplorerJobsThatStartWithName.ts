//import {toStr} from '@enonic/js-utils';

import {listExplorerJobs} from '/lib/explorer/scheduler/listExplorerJobs';


export function listExplorerJobsThatStartWithName({name}) {
	const explorerJobs = listExplorerJobs();
	//log.info(`explorerJobs:${toStr(explorerJobs)}`);
	const explorerJobsThatStartWithName = explorerJobs.filter(({name: n}) => n.startsWith(name));
	//log.info(`name:${name} explorerJobsThatStartWithName:${toStr(explorerJobsThatStartWithName)}`);
	return explorerJobsThatStartWithName;
}
