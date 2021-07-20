import {
	DOT_SIGN//,
	//toStr
} from '@enonic/js-utils';

import {query as queryCollectors} from '/lib/explorer/collector/query';
import {
	USER_EXPLORER_APP_NAME,
	USER_EXPLORER_APP_ID_PROVIDER
} from '/lib/explorer/model/2/constants';
import {createOrModifyJob} from '/lib/explorer/scheduler/createOrModifyJob';
import {listExplorerJobsThatStartWithName} from '/lib/explorer/scheduler/listExplorerJobsThatStartWithName';

import {forceArray} from '/lib/util/data';
import {delete as deleteJob} from '/lib/xp/scheduler';


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


export function createOrModifyJobsFromCollectionNode({
	connection,
	collectors = getCollectors({connection}),
	collectionNode,
	timeZone = 'GMT+02:00' // CEST (Summer Time)
	//timeZone = 'GMT+01:00' // CET
}) {
	const {
		//_id: collectionNodeId,
		_name: collectionNodeName,
		//_path: collectionNodePath,
		collector: {
			name: collectorId,
			config: collectorConfig
		} = {},
		cron: cronMaybeArray,
		doCollect = false
	} = collectionNode;

	const jobPrefix = `${collectorId.replace(':', DOT_SIGN)}${DOT_SIGN}${collectionNodeName}${DOT_SIGN}`;

	const existingJobs = listExplorerJobsThatStartWithName({name: jobPrefix});
	//log.info(`collection name:${collectionNodeName} existingJobs:${toStr(existingJobs)}`);

	if (!collectorId) {
		log.error(`Collection with name:${collectionNodeName} is missing a collector!`);
		existingJobs.forEach(({name}) => {
			log.warning(`Deleting job name:${name}, because the collection with name:${collectionNodeName} doesn't specify a collectorId!`);
			deleteJob({name});
		});
		return;
	}

	if(!collectors[collectorId]) {
		log.error(`Collection with name:${collectionNodeName} is using a non-existant collector ${collectorId}!`);
		existingJobs.forEach(({name}) => {
			log.warning(`Deleting job name:${name}, because the collection with name:${collectionNodeName} is using a non-existant collector ${collectorId}!`);
			deleteJob({name});
		});
		return;
	}

	const cronArray = forceArray(cronMaybeArray);

	// When a collection node is created, or modified, a number of things can happen:
	// 1. One or more cron definitions may have been created.
	// 2. One, more or all cron definitions may have been updated.
	// 3. One, more or all cron definitions may have been deleted.
	// 4. The order of the cron definitions may have been changed.
	// 5. A combination of the four previous points.
	//
	// Since a cron definition doesn't have a unique id in the collection node,
	// the safest thing would be to delete all scheduled jobs for the collection
	// and then re-add them...

	log.debug(`Deleting all scheduled jobs belonging to the collection with name:${collectionNodeName} (before creating new ones).`);
	existingJobs.forEach(({name}) => {
		log.debug(`Deleting job name:${name} belonging to the collection with name:${collectionNodeName} (before creating new ones).`);
		deleteJob({name});
	});

	const configJson = JSON.stringify(collectorConfig);
	const createdOrModifiedJobs = cronArray.map(({
		minute = '*',
		hour = '*',
		dayOfMonth = '*',
		month = '*',
		dayOfWeek = '*'
	}, i) => {
		const createdOrModifiedJob = createOrModifyJob({ // Since I'm deleting all first, create would have sufficed here
			config: {
				name: collectionNodeName,
				collectorId,
				configJson
			},
			descriptor: collectorId,
			enabled: doCollect,
			name: `${jobPrefix}${i}`,
			schedule: {
				timeZone,
				type: 'CRON',
				value: `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
			},
			user: USER
		}); // createOrModifyJob
		//log.info(`createdOrModifiedJob:${toStr(createdOrModifiedJob)}`);
		return createdOrModifiedJob;
	}); // cronArray.forEach

	//log.info(`createdOrModifiedJobs:${toStr(createdOrModifiedJobs)}`);
	return createdOrModifiedJobs;
} // createOrModifyJobsFromCollectionNode
