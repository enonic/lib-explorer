import {toStr} from '/lib/enonic/util';
//import {getUser} from '/lib/xp/auth';
import {get as getContext} from '/lib/xp/context';
import {multiRepoConnect} from '/lib/xp/node';
import {list as listRepos} from '/lib/xp/repo';

import {runAsSu} from '/lib/enonic/yase/runAsSu';


export function connectRepos({
	sources,
	context = getContext(),
	principals: passedPrincipals,
	repoList = runAsSu(() => listRepos()),

	// There might not be a logged in user
	login = context.authInfo.user && context.authInfo.user.login,
	userStore = context.authInfo.user && context.authInfo.user.userStore,
	user = login ? {
		login,
		userStore
	} : null
}) {
	const contextPrincipals = context.authInfo.principals;

	const basePrincipals = [].concat(contextPrincipals);
	if (Array.isArray(passedPrincipals)) {
		passedPrincipals.forEach(passedPrincipal => {
			if(!basePrincipals.includes(passedPrincipal)) {
				basePrincipals.push(passedPrincipal);
			}
		});
	}
	//log.info(toStr({contextPrincipals, passedPrincipals, basePrincipals}));
	const repos = {};
	repoList.forEach(({id, branches}) => {
		repos[id] = branches;
	});
	//log.info(toStr({repos}));

	const existingReposWithBranch = [];
	const missingReposWithBranch = [];
	sources.forEach(({
		branch,
		principals: sourcePrincipals,
		repoId
	}) => {
		//log.info(toStr({repoId}));
		if (repos[repoId] && repos[repoId].includes(branch)) {
			existingReposWithBranch.push({branch, sourcePrincipals, repoId});
		} else {
			missingReposWithBranch.push({branch, sourcePrincipals, repoId});
		}
	});
	//log.info(toStr({existingReposWithBranch, missingReposWithBranch}));
	if (missingReposWithBranch.length) { // TODO log error or throw could be configurable
		log.error(`Skipping missing sources: ${toStr(missingReposWithBranch)}`);
	}

	const sourcesWithExtendedPrincipals = existingReposWithBranch.map(({
		branch,
		sourcePrincipals,
		repoId
	}) => {
		const principals = [].concat(basePrincipals);
		if (Array.isArray(sourcePrincipals)) {
			sourcePrincipals.forEach(sourcePrincipal => {
				if(!principals.includes(sourcePrincipal)) {
					principals.push(sourcePrincipal);
				}
			});
		}
		//log.info(toStr({basePrincipals, sourcePrincipals, principals}));
		return {
			branch,
			principals,
			repoId,
			user
		}
	});
	//log.info(toStr({sourcesWithExtendedPrincipals}));

	return multiRepoConnect({sources: sourcesWithExtendedPrincipals});
} // function connectRepos
