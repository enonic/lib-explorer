// import {toStr} from '@enonic/js-utils/value/toStr';
import { startsWith } from '@enonic/js-utils/string/startsWith';
import { listExplorerJobs } from '/lib/explorer/scheduler/listExplorerJobs';


export function listExplorerJobsThatStartWithName({ name }: { name: string }) {
	const explorerJobs = listExplorerJobs();
	// log.info('explorerJobs:%s', toStr(explorerJobs));
	const explorerJobsThatStartWithName = explorerJobs.filter(({ name: n }) => startsWith(n, name));
	// log.info('name:%s explorerJobsThatStartWithName:%s', name, toStr(explorerJobsThatStartWithName));
	return explorerJobsThatStartWithName;
}
