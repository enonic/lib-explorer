import type {RepoConnection} from '/lib/explorer/types.d';


//import {toStr} from '@enonic/js-utils';

//import {getUser} from '/lib/xp/auth';
//@ts-ignore
import {get as getContext} from '/lib/xp/context';
//@ts-ignore
import {connect as libConnect} from '/lib/xp/node';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	BRANCH_ID_EXPLORER,
	PRINCIPAL_EXPLORER_READ,
	REPO_ID_EXPLORER
} from '/lib/explorer/constants';


export function connect({
	context = getContext(),
	repoId = REPO_ID_EXPLORER,
	branch = BRANCH_ID_EXPLORER,
	principals: passedPrincipals = [PRINCIPAL_EXPLORER_READ],

	// There might not be a logged in user
	login = context.authInfo.user && context.authInfo.user.login,
	idProvider = context.authInfo.user && context.authInfo.user.idProvider,
	user = login ? {
		login,
		idProvider
	} : null
} = {}) :RepoConnection {
	/*log.info(toStr({
		//context,
		repoId, branch, passedPrincipals, user
	}));*/
	//const maybeUser = getUser(); log.info(toStr({maybeUser}));
	const contextPrincipals = context.authInfo.principals;
	//log.info(toStr({contextPrincipals}));

	const principals = [];
	if (contextPrincipals && Array.isArray(contextPrincipals)) {
		contextPrincipals.forEach(contextPrincipal =>
			principals.push(contextPrincipal));
	}
	//log.info(toStr({principals}));

	if (Array.isArray(passedPrincipals)) {
		passedPrincipals.forEach(passedPrincipal => {
			if(!principals.includes(passedPrincipal)) {
				principals.push(passedPrincipal);
			}
		});
	}
	//log.info(toStr({contextPrincipals, passedPrincipals, principals}));

	const connectParams = {
		repoId,
		branch,
		principals,
		user
	};
	//log.info(toStr({connectParams}));
	return libConnect(connectParams);
}
