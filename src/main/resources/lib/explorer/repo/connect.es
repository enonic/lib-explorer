//import {toStr} from '/lib/util';
//import {getUser} from '/lib/xp/auth';
import {get as getContext} from '/lib/xp/context';
import {connect as libConnect} from '/lib/xp/node';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	BRANCH_ID,
	PRINCIPAL_YASE_READ,
	REPO_ID
} from '/lib/explorer/constants';


export function connect({
	context = getContext(),
	repoId = REPO_ID,
	branch = BRANCH_ID,
	principals: passedPrincipals = [PRINCIPAL_YASE_READ],

	// There might not be a logged in user
	login = context.authInfo.user && context.authInfo.user.login,
	userStore = context.authInfo.user && context.authInfo.user.userStore,
	user = login ? {
		login,
		userStore
	} : null
} = {}) {
	//log.info(toStr({repoId}));
	//const maybeUser = getUser(); log.info(toStr({maybeUser}));
	//log.info(toStr({context}));
	const contextPrincipals = context.authInfo.principals;

	const principals = [].concat(contextPrincipals);
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
