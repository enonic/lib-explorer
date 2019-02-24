//import {toStr} from '/lib/enonic/util';
//import {getUser} from '/lib/xp/auth';
import {get as getContext} from '/lib/xp/context';
import {connect} from '/lib/xp/node';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {BRANCH_ID, REPO_ID} from '/lib/enonic/yase/constants';


export function connectRepo({
	context = getContext(),
	repoId = REPO_ID,
	branch = BRANCH_ID,
	principals: passedPrincipals,

	// There might not be a logged in user
	login = context.authInfo.user && context.authInfo.user.login,
	userStore = context.authInfo.user && context.authInfo.user.userStore,
	user = login ? {
		login,
		userStore
	} : null
} = {}) {
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
	return connect(connectParams);
}
