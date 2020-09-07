import {list, schedule, unschedule} from '/lib/cron';
import {toStr} from '/lib/util';
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
	}).hits.forEach(({
		_name
	}) => {
		collectors[_name] = true;
	});
	return collectors;
}


export function reschedule({
	collectors = {},
	node,
	oldNode
}) {
	//log.debug(`collectors:${toStr(collectors)}`);
	//log.debug(`node:${toStr(node)}`);
	//log.debug(`oldNode:${toStr(oldNode)}`);

	if (!node && oldNode && oldNode.doCollect && oldNode.cron) {
		// A collection node (with scheduling) has been deleted, just unschedule and return
		forceArray(oldNode.cron).forEach((ignored, i) => {
			const jobName = `${id}:${i}`;
			log.debug(`Unscheduling deleted ${jobName}`);
			unschedule({name: jobName});
		});
		const cronList = list();
		log.debug(`after delete cronList:${toStr({cronList})}`);
		return;
	}

	// A collection node has been created or modified
	const {
		_id: id,
		_name: collectionName,
		collector: {
			name: collectorId,
			config: collectorConfig
		} = {},
		cron: cronMaybeArray,
		displayName: collectionDisplayName,
		doCollect = false
	} = node;
	//log.debug(`id:${toStr(id)}`);
	//log.debug(`collectionName:${toStr(collectionName)}`);
	//log.debug(`collectorId:${toStr(collectorId)}`);
	//log.debug(`collectorConfig:${toStr(collectorConfig)}`);
	//log.debug(`cronMaybeArray:${toStr(cronMaybeArray)}`);
	//log.debug(`collectionDisplayName:${toStr(collectionDisplayName)}`);
	//log.debug(`doCollect:${toStr(doCollect)}`);
	const cronArray = forceArray(cronMaybeArray);
	//log.debug(`cronArray:${toStr(cronArray)}`);

	const oldCronArray = oldNode ? forceArray(oldNode.cron) : cronArray;
	//log.debug(`oldCronArray:${toStr(oldCronArray)}`);

	oldCronArray.forEach((ignored, i) => {
		const jobName = `${id}:${i}`;
		log.debug(`Unscheduling old ${jobName}`);
		unschedule({name: jobName});
	});
	const cronList = list();
	log.debug(`After unscheduling cronList:${toStr({cronList})}`);

	if (doCollect) {
		//log.debug(`doCollect:${toStr(doCollect)}`);
		if (!collectorId) {
			log.warning(`Collection ${collectionDisplayName} is missing a collector!`);
		} else {
			//log.info(toStr({collectorId}));
			if(!collectors[collectorId]) {
				log.error(`Collection ${collectionDisplayName} is using a non-existant collector ${collectorId}!`);
			} else {
				const configJson = JSON.stringify(collectorConfig);
				//log.debug(`configJson:${toStr(configJson)}`);

				const taskParams = {
					name: collectorId,
					config: {
						name: collectionName,
						collectorId,
						configJson
					}
				};
				//log.debug(`taskParams:${toStr(taskParams)}`);

				//log.debug(`cronArray:${toStr(cronArray)}`);
				cronArray.forEach(({
					minute = '*',
					hour = '*',
					dayOfMonth = '*',
					month = '*',
					dayOfWeek = '*'
				}, i) => {
					const cron = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
					const jobName = `${id}:${i}`;
					//log.debug(`jobName:${toStr(jobName)} cron:${toStr(cron)}`);
					log.debug(`Scheduling ${jobName} with taskParams:${toStr(taskParams)}`);
					schedule({
						callback: () => submitNamed(taskParams),
						context: {
							//attributes: {}, // (object) Map of context attributes.
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
						//delay:, // (number) The time to delay first execution. Can’t be set with (cron).
						//fixedDelay: , // (number) The delay between the termination of one execution and the commencement of the next. Can’t be set with (cron).
						name: jobName/*,
						times: 0*/ // (number) Number of task runs. Leave it empty for infinite calls.
					}); // schedule
				}); // cronArray.forEach
				const cronList = list();
				log.debug(`After re-scheduling cronList:${toStr({cronList})}`);
			} // collectors[collectorId]
		} // if collectorId
	} // if doCollect
} // export function reschedule
