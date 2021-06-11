import {
	coerce,
	gte,
	lt,
	//satisfies,
	valid
} from 'semver';

import {list as getApplications} from '/lib/explorer/application';
import {
	NT_COLLECTOR,
	PRINCIPAL_EXPLORER_WRITE,
	USER_EXPLORER_APP_KEY
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {createOrModify} from '/lib/explorer/node/createOrModify';
//import {toStr} from '/lib/util';


export function register({
	appName,
	collectTaskName = 'collect',
	componentPath, // window.MyLibraryName.ComponentName
	configAssetPath = 'js/react/Collector.esm.js',
	displayName
}) {
	//──────────────────────────────────────────────────────────────────────────
	// Only give deprecation warning when app-explorer version is >=1.5.0 <2.0.0
	//──────────────────────────────────────────────────────────────────────────
	const nonSytemApps = getApplications({
		filterOnIsSystemEquals: false,
		getVersion: true
	}).filter(({key}) => key === 'com.enonic.app.explorer');
	//log.debug(`nonSytemApps:${toStr(nonSytemApps)}`);

	if (nonSytemApps.length) { // Explorer installed?
		const explorerVersion = nonSytemApps[0].version;
		//log.debug(`explorerVersion:${toStr(explorerVersion)}`);
		const coercedExplorerVersion = coerce(explorerVersion);
		//log.debug(`coercedExplorerVersion:${toStr(coercedExplorerVersion)}`);
		const validCoercedExplorerVersion = valid(coercedExplorerVersion);
		//log.debug(`validCoercedExplorerVersion:${toStr(validCoercedExplorerVersion)}`);

		//const satisfiesRange = satisfies(validCoercedExplorerVersion, '^1.5.0'); // '>=1.5.0 <2.0.0'
		//const satisfiesRange = satisfies(validCoercedExplorerVersion, '>=1.5.0 <2.0.0');
		//log.debug(`satisfiesRange:${toStr(satisfiesRange)}`);

		const greaterThanOrEqual = gte(validCoercedExplorerVersion, '1.5.0');
		//log.debug(`greaterThanOrEqual:${toStr(greaterThanOrEqual)}`);

		const lessThan = lt(validCoercedExplorerVersion, '2.0.0');
		//log.debug(`lessThan:${toStr(lessThan)}`);

		if(greaterThanOrEqual && lessThan) {
			log.warning(`collector/register has been deprecated, please include a src/main/resources/collectors.json instead.
				Example: [{
					"componentPath": "${componentPath}",
					"configAssetPath": "${configAssetPath}",
					"displayName": "${displayName}",
					"taskName": "${collectTaskName}"
				}]`);
		}
	}
	//──────────────────────────────────────────────────────────────────────────

	const writeConnection = connect({
		principals: [PRINCIPAL_EXPLORER_WRITE]
	});
	const params = {
		__connection: writeConnection,
		__user: {
			key: USER_EXPLORER_APP_KEY
		},
		__sanitize: false,
		_parentPath: '/collectors',
		_name: `${appName}:${collectTaskName}`,
		appName,
		collectTaskName,
		componentPath,
		configAssetPath,
		displayName,
		type: NT_COLLECTOR
	};
	return createOrModify(params);
}
