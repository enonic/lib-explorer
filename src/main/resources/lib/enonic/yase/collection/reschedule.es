import {schedule, unschedule} from '/lib/cron';
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {submitNamed} from '/lib/xp/task';

import {
	PRINCIPAL_SYSTEM_ADMIN,
	PRINCIPAL_YASE_WRITE,
	USER_YASE_JOB_RUNNER_NAME,
	USER_YASE_JOB_RUNNER_USERSTORE
} from '/lib/enonic/yase/constants';
import {query as queryCollectors} from '/lib/enonic/yase/collector/query';


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
								login: USER_YASE_JOB_RUNNER_NAME,
								userStore: USER_YASE_JOB_RUNNER_USERSTORE
							},
							principals: [ // // Additional principals to execute the callback with.
								PRINCIPAL_SYSTEM_ADMIN, // Needed for creating repos.
								PRINCIPAL_YASE_WRITE
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
