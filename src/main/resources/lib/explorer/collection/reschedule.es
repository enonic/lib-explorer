import {
	//list,
	//schedule,
	unschedule
} from '/lib/cron';
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {
	delete as deleteJob//,
	//get as getJob
} from '/lib/xp/scheduler';
//import {submitTask} from '/lib/xp/task';

import {
	DOT_SIGN,
	USER_EXPLORER_APP_NAME,
	USER_EXPLORER_APP_ID_PROVIDER
} from '/lib/explorer/model/2/constants';
import {query as queryCollectors} from '/lib/explorer/collector/query';
import {createOrModifyJob} from '/lib/explorer/scheduler/createOrModifyJob';
//import {listExplorerJobs} from '/lib/explorer/scheduler/listExplorerJobs';
//import {listExplorerJobsThatStartWithName} from '/lib/explorer/scheduler/listExplorerJobsThatStartWithName';


const USER = `user:${USER_EXPLORER_APP_ID_PROVIDER}:${USER_EXPLORER_APP_NAME}`;


export function getCollectors({
	connection
}) {
	const collectors = {};
	queryCollectors({
		connection
	}).hits.forEach(({
		appName,
		collectTaskName
	}) => {
		collectors[`${appName}:${collectTaskName}`] = true;
	});
	return collectors;
}


export function reschedule({
	collectors = {},
	node,
	oldNode
}) {
	//const explorerJobsList = listExplorerJobs();
	//log.info(`explorerJobsList:${toStr(explorerJobsList)}`);

	//log.debug(`collectors:${toStr(collectors)}`);
	//log.debug(`node:${toStr(node)}`);
	//log.debug(`oldNode:${toStr(oldNode)}`);

	if (!node && oldNode && oldNode.doCollect && oldNode.cron) {
		// A collection node (with scheduling) has been deleted, just unschedule and return
		const {
			_id: oldCollectionNodeId
		} = oldNode;
		//const explorerJobsThatStartWithName = listExplorerJobsThatStartWithName({name: oldCollectionNodeId});
		//log.info(`oldCollectionNodeId:${oldCollectionNodeId} explorerJobsThatStartWithName:${toStr(explorerJobsThatStartWithName)}`);

		forceArray(oldNode.cron).forEach((ignored, i) => {
			const jobName = `${oldCollectionNodeId}${DOT_SIGN}${i}`;
			//log.debug(`Unscheduling deleted ${jobName}`);
			deleteJob({name: jobName});
			unschedule({name: jobName}); // TODO: Remove in lib-explorer-4.0.0?
		});
		//const explorerJobsList = listExplorerJobs();
		//log.debug(`after delete cronList:${toStr({explorerJobsList})}`);
		return;
	}

	// A collection node has been created or modified
	const {
		_id: collectionNodeId,
		_name: collectionName,
		collector: {
			name: collectorId,
			config: collectorConfig
		} = {},
		cron: cronMaybeArray,
		displayName: collectionDisplayName,
		doCollect = false
	} = node;
	//log.debug(`collectionNodeId:${toStr(collectionNodeId)}`);
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

	// When a collection node is modified, the number of cron definitions may
	// increase or decrease, or the order of them can be changed.
	// So the index may no longer refer to the same time as previous.
	// Thus we have to delete ALL previous jobs and re-add them.
	oldCronArray.forEach((ignored, i) => {
		//const explorerJobsThatStartWithName = listExplorerJobsThatStartWithName({name: collectionNodeId});
		//log.info(`collectionNodeId:${collectionNodeId} explorerJobsThatStartWithName:${toStr(explorerJobsThatStartWithName)}`);

		const jobName = `${collectionNodeId}:${i}`;
		//log.debug(`Unscheduling old ${jobName}`);
		deleteJob({name: jobName});
		unschedule({name: jobName}); // TODO: Remove in lib-explorer-4.0.0?
	});
	//const cronList = list();
	//log.debug(`After unscheduling cronList:${toStr({cronList})}`);

	if (!collectorId) {
		log.warning(`Collection ${collectionDisplayName} is missing a collector!`);
		//const explorerJobsThatStartWithName = listExplorerJobsThatStartWithName({name: collectionNodeId});
		//log.info(`collectionNodeId:${collectionNodeId} explorerJobsThatStartWithName:${toStr(explorerJobsThatStartWithName)}`);
		for (let i = 0; i < cronArray.length; i++) {
			const jobName = `${collectionNodeId}${DOT_SIGN}${i}`;
			deleteJob({name: jobName});
			unschedule({name: jobName}); // TODO: Remove in lib-explorer-4.0.0?
		}
		return;
	}

	//log.info(toStr({collectorId}));
	if(!collectors[collectorId]) {
		log.error(`Collection ${collectionDisplayName} is using a non-existant collector ${collectorId}!`);
		//const explorerJobsThatStartWithName = listExplorerJobsThatStartWithName({name: collectionNodeId});
		//log.info(`collectionNodeId:${collectionNodeId} explorerJobsThatStartWithName:${toStr(explorerJobsThatStartWithName)}`);
		for (let i = 0; i < cronArray.length; i++) {
			const jobName = `${collectionNodeId}${DOT_SIGN}${i}`;
			deleteJob({name: jobName});
			unschedule({name: jobName}); // TODO: Remove in lib-explorer-4.0.0?
		}
		return;
	}

	const configJson = JSON.stringify(collectorConfig);
	//log.debug(`configJson:${toStr(configJson)}`);
	//log.debug(`cronArray:${toStr(cronArray)}`);
	cronArray.forEach(({
		minute = '*',
		hour = '*',
		dayOfMonth = '*',
		month = '*',
		dayOfWeek = '*'
	}, i) => {
		//const createdOrModifiedJob =
		createOrModifyJob({
			config: {
				name: collectionName,
				collectorId,
				configJson
			},
			descriptor: collectorId,
			enabled: doCollect,
			name: `${collectionNodeId}${DOT_SIGN}${i}`,
			schedule: {
				// GMT === UTC
				timeZone: 'GMT+02:00', // CEST (Summer Time)
				//timeZone: 'GMT+01:00', // CET
				type: 'CRON',
				value: `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
			},
			user: USER
		}); // createOrModifyJob
		//log.info(`createdOrModifiedJob:${toStr(createdOrModifiedJob)}`);
	}); // cronArray.forEach
	//const explorerJobsList = listExplorerJobs();
	//log.info(`explorerJobsList:${toStr(explorerJobsList)}`);
} // export function reschedule
