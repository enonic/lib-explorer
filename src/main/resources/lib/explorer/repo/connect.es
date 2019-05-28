//import {toStr} from '/lib/util';
//import {getUser} from '/lib/xp/auth';
import {get as getContext} from '/lib/xp/context';
import {connect as libConnect} from '/lib/xp/node';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	BRANCH_ID_EXPLORER,
	PRINCIPAL_EXPLORER_READ,
	REPO_ID_EXPLORER
} from '/lib/explorer/model/2/constants';


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
