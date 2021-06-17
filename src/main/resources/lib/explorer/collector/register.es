import {
	coerce,
	//gte,
	lt,
	//satisfies,
	valid
} from 'semver';

import {list as getApplications} from '/lib/explorer/application';
import {unregister} from '/lib/explorer/collector';
import {
	NT_COLLECTOR,
	PRINCIPAL_EXPLORER_WRITE,
	USER_EXPLORER_APP_KEY
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {createOrModify} from '/lib/explorer/node/createOrModify';

//import {toStr} from '/lib/util';
import {isMaster} from '/lib/xp/cluster';
import {
	getResource//,
	//readText
} from '/lib/xp/io';


const RESOURCE_KEY = Java.type('com.enonic.xp.resource.ResourceKey');

/*
 Version of installed app-explorer:
  <1.5.0 register node as always
  >=1.5.0 <2.0.0 collectors.json provided ? unregister : Warn deprecation and register
  >2.0.0 Error deprecation, but still collectors.json provided ? unregister : register

  TODO: In lib-explorer-4.0.0/app-explorer-2.0.0 This file will be deleted, which will result in buildtime error.

  However:
   There might be a collector built with for 1.5.0 when 1.4.0 is installed so display error.
   There might be a collector built with for 1.5.0 when 2.0.0 is installed so display error.
*/



export function register({
	appName,
	collectTaskName = 'collect',
	componentPath, // window.MyLibraryName.ComponentName
	configAssetPath = 'js/react/Collector.esm.js',
	displayName
}) {
	if (isMaster) {
		let boolRegister = true;
		let boolUnregister = false;

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

			const lessThan15 = lt(validCoercedExplorerVersion, '1.5.0');
			//log.info(`lessThan15:${toStr(lessThan15)}`);
			if (lessThan15) {
				boolRegister = true;
				boolUnregister = false;
			} else { // > 1.5.0
				//const greaterThanOrEqual = gte(validCoercedExplorerVersion, '1.5.0');
				//log.debug(`greaterThanOrEqual:${toStr(greaterThanOrEqual)}`);

				//──────────────────────────────────────────────────────────────
				// Does the collector built with this lib include a collectors.json?
				//──────────────────────────────────────────────────────────────
				const filePath = 'collectors.json';
				const resourcePath = `${appName}:${filePath}`;
				const resource = getResource(RESOURCE_KEY.from(resourcePath));
				const boolCollectorsJsonProvided = resource.exists();
				/*if (resource.exists()) {
					const resourceJson = readText(resource.getStream());
					//log.debug(`resourcePath:${resourcePath} resourceJson:${resourceJson}`);
					try {
						const resourceData = JSON.parse(resourceJson);
						log.info(`resourcePath:${resourcePath} resourceData:${toStr(resourceData)}`);
					} catch (e) {
						log.error(`Something went wrong while parsing resource path:${resourcePath} json:${resourceJson}!`, e);
					}
				}*/

				if (boolCollectorsJsonProvided) {
					boolRegister = false;
					boolUnregister = true;
				} else { // CollectorsJson not provided
					boolRegister = true;
					boolUnregister = false;
					const lessThan2 = lt(validCoercedExplorerVersion, '2.0.0');
					//log.info(`lessThan2:${toStr(lessThan2)}`);

					const deprecationMsg = `collector/register has been deprecated, please include a src/main/resources/collectors.json.
					Example: [{
						"componentPath": "${componentPath}",
						"configAssetPath": "${configAssetPath}",
						"displayName": "${displayName}",
						"taskName": "${collectTaskName}"
					}]`;

					if (lessThan2) {
						log.warning(deprecationMsg);
					} else { // > 2.0.0
						log.error(deprecationMsg);
					}
				}
			}
		}

		if (boolRegister) {
			const writeConnection = connect({
				principals: [PRINCIPAL_EXPLORER_WRITE]
			});
			const params = {
				_parentPath: '/collectors',
				_name: `${appName}:${collectTaskName}`,
				appName,
				collectTaskName,
				componentPath,
				configAssetPath,
				displayName,
				type: NT_COLLECTOR
			};
			return createOrModify(params, {
				connection: writeConnection,
				sanitize: false,
				user: { // NOTE: does not affect modify
					key: USER_EXPLORER_APP_KEY
				}
			});
		} else if (boolUnregister) {
			unregister({
				appName,
				collectTaskName
			});
		}
	} // if isMaster
}
