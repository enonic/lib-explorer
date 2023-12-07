// import {toStr} from '@enonic/js-utils/value/toStr';
import {listExplorerJobs} from '/lib/explorer/scheduler/listExplorerJobs';


export function listExplorerJobsThatStartWithName({name}: {name: string}) {
	const explorerJobs = listExplorerJobs();
	// log.info('explorerJobs:%s', toStr(explorerJobs));
	const explorerJobsThatStartWithName = explorerJobs.filter(({name: n}) => n.startsWith(name));
	// log.info('name:%s explorerJobsThatStartWithName:%s', name, toStr(explorerJobsThatStartWithName));
	return explorerJobsThatStartWithName;
}
