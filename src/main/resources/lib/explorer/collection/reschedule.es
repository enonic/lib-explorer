import {schedule, unschedule} from '/lib/cron';
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {submitNamed} from '/lib/xp/task';

import {
	PRINCIPAL_SYSTEM_ADMIN,
	PRINCIPAL_EXPLORER_WRITE,
	USER_EXPLORER_APP_NAME,
	USER_EXPLORER_APP_ID_PROVIDER
} from '/lib/explorer/model/2/constants';
import {query as queryCollectors} from '/lib/explorer/collector/query';


export function getCollectors({
	connection
}) {
	const collectors = {};
	queryCollectors({
		connection
	}).hits.forEach(({_name: application, collectTaskName}) => {
		collectors[application] = collectTaskName;
	});
	return collectors;
}


export function reschedule({
	collectors,
	node,
	oldNode
}) {
	//log.info(toStr({collectors, node}));
	const {
		_id: id,
		_name: collectionName,
		collector: {
			name: collectorName,
			config: collectorConfig
		} = {},
		cron: cronMaybeArray,
		displayName: collectionDisplayName,
		doCollect = false
	} = node;
	const cronArray = forceArray(cronMaybeArray);
	//log.info(toStr({id, collectionName, collectorName, cronMaybeArray, cronArray, collectionDisplayName, doCollect}));

	const oldCronArray = oldNode ? forceArray(oldNode.cron) : cronArray;
	oldCronArray.forEach((ignored, i) => {
		unschedule({name: `${id}:${i}`});
	});

	if (doCollect) {
		//log.info(toStr({doCollect}));
		if (!collectorName) {
			log.warning(`Collection ${collectionDisplayName} is missing a collector!`);
		} else {
			//log.info(toStr({collectorName}));
			if(!collectors[collectorName]) {
				log.error(`Collection ${collectionDisplayName} is using a non-existant collector ${collectorName}!`);
			} else {
				const taskName = `${collectorName}:${collectors[collectorName]}`;
				//log.info(toStr({taskName}));

				const configJson = JSON.stringify(collectorConfig);
				//log.info(toStr({configJson}));

				const taskParams = {
					name: taskName,
					config: {
						name: collectionName,
						configJson
					}
				};
				//log.info(toStr({taskParams}));

				//log.info(toStr({cronArray}));
				cronArray.forEach(({minute, hour, dayOfMonth, month, dayOfWeek}, i) => {
					const cron = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
					const jobName = `${id}:${i}`;
					//log.info(toStr({jobName, cron}));
					schedule({
						callback: () => submitNamed(taskParams),
						context: {
							branch: 'master', // Repository to execute the callback in.
							repository: 'system-repo', // Name of the branch to execute the callback in.
							user: { // User to execute the callback with.
								login: USER_EXPLORER_APP_NAME,
								idProvider: USER_EXPLORER_APP_ID_PROVIDER
							},
							principals: [ // // Additional principals to execute the callback with.
								PRINCIPAL_SYSTEM_ADMIN, // Needed for creating repos.
								PRINCIPAL_EXPLORER_WRITE
							]
						},
						cron,
						name: jobName
					});
				});
			}
		}
	}
}
