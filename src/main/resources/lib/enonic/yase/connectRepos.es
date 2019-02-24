//import {toStr} from '/lib/enonic/util';
//import {getUser} from '/lib/xp/auth';
import {get as getContext} from '/lib/xp/context';
import {multiRepoConnect} from '/lib/xp/node';


export function connectRepos({
	sources,
	context = getContext(),
	principals: passedPrincipals,

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

	const sourcesWithExtendedPrincipals = sources.map(({
		branch,
		principals: sourcePrincipals,
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
