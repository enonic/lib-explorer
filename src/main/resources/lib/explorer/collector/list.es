//import {toStr} from '@enonic/js-utils';

import {list as getApplications} from '/lib/explorer/application';
import {getResource, readText} from '/lib/xp/io';


const RESOURCE_KEY = Java.type('com.enonic.xp.resource.ResourceKey');


export function list() {
	const startedNonSytemApps = getApplications({
		filterOnIsStartedEquals: true,
		filterOnIsSystemEquals: false
	});
	//log.debug(`startedNonSytemApps:${toStr(startedNonSytemApps)}`);

	const collectors = [];
	startedNonSytemApps.forEach((appKey) => {
		const filePath = 'collectors.json';
		const resourcePath = `${appKey}:${filePath}`;
		const resource = getResource(RESOURCE_KEY.from(resourcePath));
		if (resource.exists()) {
			const resourceJson = readText(resource.getStream());
			//log.debug(`resourcePath:${resourcePath} resourceJson:${resourceJson}`);
			try {
				const resourceData = JSON.parse(resourceJson);
				//log.debug(`resourcePath:${resourcePath} resourceData:${toStr(resourceData)}`);
				resourceData.forEach((item) => {
					item.appName = appKey;
					collectors.push(item);
				});

			} catch (e) {
				log.error(`Something went wrong while parsing resource path:${resourcePath} json:${resourceJson}!`, e);
			}
		}
	});
	//log.debug(`collectors:${toStr(collectors)}`);
	return collectors;
}
