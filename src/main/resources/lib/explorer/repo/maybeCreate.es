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
	let getRepoRes = getRepo(repoId);

	if (!getRepoRes) {
		const createRepoParams = {
			id: repoId,
			rootPermissions
		};
		createRepo(createRepoParams);
	} // !repo exists

	getRepoRes = getRepo(repoId);
	const branchAlreadyExists = getRepoRes.branches.includes(branchId);

	return branchAlreadyExists
		? {id: branchId}
		: createRepoBranch({
			branchId, // NOTE lib.xp.repo.createBranch uses branchId not branch!
			repoId
		});
} // function maybeCreate
