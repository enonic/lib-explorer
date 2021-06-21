import {listExplorerJobs} from '/lib/explorer/scheduler/listExplorerJobs';
//import {toStr} from '/lib/util';


export function listExplorerJobsThatStartWithName({name}) {
	const explorerJobs = listExplorerJobs();
	//log.info(`explorerJobs:${toStr(explorerJobs)}`);
	const explorerJobsThatStartWithName = explorerJobs.filter(({name: n}) => n.startsWith(name));
	//log.info(`name:${name} explorerJobsThatStartWithName:${toStr(explorerJobsThatStartWithName)}`);
	return explorerJobsThatStartWithName;
}
