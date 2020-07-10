//import {toStr} from '/lib/util';
import {
	get as getRepo,
	create as createRepo,
	createBranch as createRepoBranch
} from '/lib/xp/repo';


import {ROOT_PERMISSIONS_EXPLORER} from '/lib/explorer/model/2/constants';


export function maybeCreate({
	repoId,
	branchId = 'master',
	rootPermissions = ROOT_PERMISSIONS_EXPLORER
}) {
	//log.info(`repoId:${toStr(repoId)}`);
	let getRepoRes = getRepo(repoId);
	//log.info(`getRepoRes:${toStr(getRepoRes)}`);

	if (!getRepoRes) {
		const createRepoParams = {
			id: repoId,
			rootPermissions,
	    	rootChildOrder: '_ts DESC'
		};
		//log.info(`createRepoParams:${toStr(createRepoParams)}`);
		createRepo(createRepoParams);
	} // !repo exists

	getRepoRes = getRepo(repoId);
	//log.info(`getRepoRes:${toStr(getRepoRes)}`);

	const branchAlreadyExists = getRepoRes.branches.includes(branchId);
	//log.info(`branchAlreadyExists:${toStr(branchAlreadyExists)}`);

	if (branchAlreadyExists) {
		return {id: branchId};
	}

	const createdRepoBranch = createRepoBranch({
		branchId, // NOTE lib.xp.repo.createBranch uses branchId not branch!
		repoId
	});
	//log.info(`createdRepoBranch:${toStr(createdRepoBranch)}`);
	return createdRepoBranch;
} // function maybeCreate
