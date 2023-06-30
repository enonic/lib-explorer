import type { SourceWithPrincipals } from '@enonic/js-utils/types/node/multiRepoConnection.d';
import type { PrincipalKey } from '/lib/explorer/types/index.d';
import type { Context } from '/lib/xp/context';
import type { MultiRepoConnection } from '/lib/xp/node';


import {
	arrayIncludes,
	// toStr
} from '@enonic/js-utils';
import {get as getContext} from '/lib/xp/context';
import {connect, multiRepoConnect} from '/lib/xp/node';
import {runAsSu} from '/lib/explorer/runAsSu';


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
} :{
	sources: SourceWithPrincipals[]
	context?: Context
	idProvider?: string
	login?: string
	principals?: PrincipalKey[]
	user?: {
		idProvider: string
		login: string
	}
}): MultiRepoConnection {
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
		});
	});
	//log.info(`existingRepos:${toStr(existingRepos)}`);

	const contextPrincipals = context.authInfo.principals;

	const basePrincipals = [].concat(contextPrincipals); // Dereference
	if (Array.isArray(passedPrincipals)) {
		passedPrincipals.forEach(passedPrincipal => {
			if(!arrayIncludes(basePrincipals, passedPrincipal)) {
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
					if(!arrayIncludes(principals, sourcePrincipal)) {
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
	//log.info(`sourcesWithExtendedPrincipals:${toStr({sourcesWithExtendedPrincipals})}`);
	/*times.push({label: 'multiConnect end', time: currentTimeMillis()});
	for (let i = 0; i < times.length - 1; i += 1) {
		log.info(`${pad(times[i + 1].time - times[i].time, 4)} ${pad(times[i + 1].time - times[0].time, 4)} ${times[i + 1].label}`);
	}*/

	if (!sourcesWithExtendedPrincipals.length) {
		throw new Error(`multiConnect: empty sources is not allowed!`);
	}

	return multiRepoConnect({sources: sourcesWithExtendedPrincipals});
} // function multiConnect
