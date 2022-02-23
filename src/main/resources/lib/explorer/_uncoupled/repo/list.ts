import type {JavaBridge} from '/lib/explorer/_coupling/types.d';
import type {Repo} from '/lib/explorer/repo/types.d';


import {
	arrayIncludes,
	startsWith//,
	//toStr
} from '@enonic/js-utils';


export interface ListParams {
	branch? :string
	branches? :Array<string>
	idStartsWith? :string
}


export function list(
	{
		branch: filterBranch = undefined,
		branches: filterBranches = filterBranch ? [filterBranch] : undefined,
		idStartsWith
	} :ListParams,
	javaBridgde :JavaBridge
) {
	let repoList = javaBridgde.repo.list() as Array<Repo>;
	//javaBridgde.log.debug('repoList:%s', toStr(repoList));

	if (filterBranches) {
		repoList = repoList.filter(({branches}) => {
			return branches.some(branch => arrayIncludes(filterBranches, branch));
		});
		//javaBridgde.log.debug('filtered on branches:%s repoList:%s', toStr(filterBranches), toStr(repoList));
	}

	if (idStartsWith) {
		repoList = repoList.filter(({id}) => startsWith(id, idStartsWith));
		//javaBridgde.log.debug('filtered on idStartsWith:%s repoList:%s', idStartsWith, toStr(repoList));
	}
	return repoList;
}
