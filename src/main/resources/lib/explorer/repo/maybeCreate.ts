// import { toStr } from '@enonic/js-utils';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import {runAsSu} from '/lib/explorer/runAsSu';
import {
	get as getRepo,
	create as createRepo,
	createBranch as createRepoBranch
} from '/lib/xp/repo';
// import {create as createNode}  from '/lib/explorer/node/create';
// import {get as getNode}  from '/lib/explorer/node/get';
import {exists as nodeExists} from '/lib/explorer/node/exists';
import {connect} from '/lib/explorer/repo/connect';
import {
	PRINCIPAL_EXPLORER_WRITE,
	ROOT_PERMISSIONS_EXPLORER
} from '/lib/explorer/constants';


export function maybeCreate({
	repoId,
	branchId = 'master',
	rootPermissions = ROOT_PERMISSIONS_EXPLORER
}) {
	// log.info(`repoId:${toStr(repoId)}`);

	// TODO Check format of repoId?

	let getRepoRes = runAsSu(() => getRepo(repoId));
	// log.info(`getRepoRes:${toStr(getRepoRes)}`);

	if (!getRepoRes) {
		const createRepoParams = {
			id: repoId,
			rootPermissions,
			rootChildOrder: '_ts DESC'
		};
		// log.info(`createRepoParams:${toStr(createRepoParams)}`);
		runAsSu(() => createRepo(createRepoParams));
	} // !repo exists

	getRepoRes = runAsSu(() => getRepo(repoId));
	// log.debug('getRepoRes:%s', toStr(getRepoRes));

	const branchAlreadyExists = arrayIncludes(getRepoRes.branches, branchId);
	// log.info(`branchAlreadyExists:${toStr(branchAlreadyExists)}`);

	if (branchAlreadyExists) {
		return {id: branchId};
	}

	const createdRepoBranch = runAsSu(() => createRepoBranch({
		branchId, // NOTE lib.xp.repo.createBranch uses branchId not branch!
		repoId
	}));
	// log.info(`createdRepoBranch:${toStr(createdRepoBranch)}`);

	// When you create a repo, the master branch is created, with a root node.
	// NOTE When you create a branch, the root node is not made in the branch!
	// Let's get the root node from the master branch and "copy" it to the branch.
	const writeConnection = connect({
		branch: branchId,
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId
	});
	if (!nodeExists({
		connection: writeConnection,
		_path: '/'
	})) {
		// const rootNodeFromMasterBranch = getNode({
		// 	connection: connect({
		// 		branch: 'master',
		// 		repoId
		// 	}),
		// 	path: '/'
		// });
		// log.info(`rootNodeFromMasterBranch:${toStr(rootNodeFromMasterBranch)}`);
		// createNode(rootNodeFromMasterBranch);
		const pushParams = {
			keys: ['/'],
			resolve: false,
			target: branchId
		};
		// log.info(`pushParams:${toStr(pushParams)}`);
		// const pushRes =
		writeConnection.push(pushParams);
		// log.info(`pushRes:${toStr(pushRes)}`);
	}

	return createdRepoBranch;
} // function maybeCreate
