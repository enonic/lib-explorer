
import {toStr} from '/lib/util';
//import {getUser} from '/lib/xp/auth';
//import {get as getContext} from '/lib/xp/context';
import {create as createRepo, createBranch} from '/lib/xp/repo';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	BRANCH_ID_EXPLORER,
	REPO_ID_EXPLORER,
	ROOT_PERMISSIONS_EXPLORER
} from '/lib/explorer/model/2/constants';


export function init({
	repoId = REPO_ID_EXPLORER,
	branchId = BRANCH_ID_EXPLORER
} = {}) {
	//log.info(`repoId:${repoId} branchId:${branchId}`);

	const createRepoParams = {
		id: repoId,
		rootPermissions: ROOT_PERMISSIONS_EXPLORER,
    	rootChildOrder: '_ts DESC'
	};
	//log.info(`createRepoParams:${toStr(createRepoParams)}`);
	//const context = getContext(); //log.info(toStr({context}));
	//const user = getUser(); //log.info(toStr({user}));
	try {
		const createRepoRes = createRepo(createRepoParams);
		//log.info(`createRepoRes:${toStr(createRepoRes)}`);
	} catch (e) {
		if (e.class.name !== 'com.enonic.xp.repo.impl.repository.RepositoryAlreadyExistException') {
			log.error(toStr({
				class: e.class,
				code: e.code,
				e
			}));
			throw e;
		}
	}
	let createBranchRes = {
		id: branchId
	};
	try {
		createBranchRes = createBranch({
			branchId, // NOTE lib.xp.repo.createBranch uses branchId not branch!
			repoId
		});
		//log.info(`createBranchRes:${toStr(createBranchRes)}`);
	} catch (e) {
		if (e.code !== 'branchAlreadyExists') {
			throw e;
		} /*else {
			log.warning(`Branch ${branchId} already exist`);
		}*/
	}
	//log.info(toStr({createBranchRes}));
	return createBranchRes;
}
