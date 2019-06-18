//import {toStr} from '/lib/util';
//import {forceArray} from '/lib/util/data';
//import {getUser} from '/lib/xp/auth';
import {get as getContext} from '/lib/xp/context';
import {connect, multiRepoConnect} from '/lib/xp/node';

import {runAsSu} from '/lib/explorer/runAsSu';
import {pad} from '/lib/explorer/string/pad';

//const {currentTimeMillis} = Java.type('java.lang.System');


export function multiConnect({
	sources,
	context = getContext(),
	principals: passedPrincipals,

	// There might not be a logged in user
	login = context.authInfo.user && context.authInfo.user.login,
	idProvider = context.authInfo.user && context.authInfo.user.idProvider,
	user = login ? {
		login,
		idProvider
	} : null
}) {
	const existingRepos = {};
	runAsSu(() => {
		connect({repoId: 'system-repo', branch: 'master'}).query({
			count: -1,
			filters: {
				ids: {
        			values: sources.map(({repoId}) => repoId)
    			}
			}
		}).hits.forEach(({id}) => {
			existingRepos[id] = true;
		})
	});

	const contextPrincipals = context.authInfo.principals;

	const basePrincipals = [].concat(contextPrincipals); // Dereference
	if (Array.isArray(passedPrincipals)) {
		passedPrincipals.forEach(passedPrincipal => {
			if(!basePrincipals.includes(passedPrincipal)) {
				basePrincipals.push(passedPrincipal);
			}
		});
	}
	//log.info(toStr({contextPrincipals, passedPrincipals, basePrincipals}));
	//log.info(toStr({repos}));

	const sourcesWithExtendedPrincipals = [];
	sources.forEach(({
		branch,
		principals: sourcePrincipals,
		repoId
	}) => {
		//log.info(toStr({repoId}));
		if (existingRepos[repoId]) { // WARNING: Assuming 'master' branch!
			const principals = [].concat(basePrincipals); // Dereference
			if (Array.isArray(sourcePrincipals)) {
				sourcePrincipals.forEach(sourcePrincipal => {
					if(!principals.includes(sourcePrincipal)) {
						principals.push(sourcePrincipal);
					}
				});
			}
			//log.info(toStr({basePrincipals, sourcePrincipals, principals}));
			sourcesWithExtendedPrincipals.push({
				branch,
				principals,
				repoId,
				user
			});
		}
	});
	//log.info(toStr({sourcesWithExtendedPrincipals}));
	/*times.push({label: 'multiConnect end', time: currentTimeMillis()});
	for (let i = 0; i < times.length - 1; i += 1) {
		log.info(`${pad(times[i + 1].time - times[i].time, 4)} ${pad(times[i + 1].time - times[0].time, 4)} ${times[i + 1].label}`);
	}*/

	return multiRepoConnect({sources: sourcesWithExtendedPrincipals});
} // function multiConnect
