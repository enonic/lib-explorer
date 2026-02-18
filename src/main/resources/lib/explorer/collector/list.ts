import type {
	Collector,
	CollectorsJsonCollector,
} from '../types/Collector';

//import {toStr} from '@enonic/js-utils';

import {list as getApplications} from '/lib/explorer/application';

//@ts-ignore
import {getResource, readText} from '/lib/xp/io';


//@ts-ignore
const RESOURCE_KEY = Java.type('com.enonic.xp.resource.ResourceKey');


export function list() {
	const startedNonSytemApps = getApplications({
		filterOnIsStartedEquals: true,
		filterOnIsSystemEquals: false
	});
	//log.debug(`startedNonSytemApps:${toStr(startedNonSytemApps)}`);

	const collectors: Collector[] = [];
	startedNonSytemApps.forEach((appKey) => {
		const filePath = 'collectors.json';
		const resourcePath = `${appKey}:${filePath}`;
		const resource = getResource(RESOURCE_KEY.from(resourcePath));
		if (resource.exists()) {
			const resourceJson: string = readText(resource.getStream());
			//log.debug(`resourcePath:${resourcePath} resourceJson:${resourceJson}`);
			try {
				const resourceData: CollectorsJsonCollector[] = JSON.parse(resourceJson);
				//log.debug(`resourcePath:${resourcePath} resourceData:${toStr(resourceData)}`);
				resourceData.forEach((item) => {
					const {
						formLibraryName,
						componentPath = `window.${formLibraryName}.CollectorForm`,

						formAssetPath,
						configAssetPath = formAssetPath,

						displayName,
						taskName,
					} = item;
					collectors.push({
						appName: appKey as string,
						componentPath,
						configAssetPath,
						displayName,
						taskName
					});
				});

			} catch (e) {
				log.error(`Something went wrong while parsing resource path:${resourcePath} json:${resourceJson}!`, e);
			}
		}
	});
	//log.debug(`collectors:${toStr(collectors)}`);
	return collectors;
}
