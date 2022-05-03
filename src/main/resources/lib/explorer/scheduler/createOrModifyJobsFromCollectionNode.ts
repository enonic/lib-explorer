import type {Application} from '../../../index.d';
import type {RepoConnection} from '/lib/explorer/types.d';
import type {CollectionWithCron} from '../types/Collection.d';
import type {WriteConnection} from '../node/WriteConnection.d';
import type {
	TaskDescriptor,
	TaskName
} from '../task/types.d';


import {
	DOT_SIGN,
	forceArray,
	//toStr,
	uniqueId
} from '@enonic/js-utils';

import {query as queryCollectors} from '/lib/explorer/collector/query';
import {
	REPO_ID_EXPLORER,
	USER_EXPLORER_APP_NAME,
	USER_EXPLORER_APP_ID_PROVIDER
} from '/lib/explorer/model/2/constants';
import {createOrModifyJob} from '/lib/explorer/scheduler/createOrModifyJob';
import {listExplorerJobsThatStartWithName} from '/lib/explorer/scheduler/listExplorerJobsThatStartWithName';

//@ts-ignore
import {delete as deleteJob} from '/lib/xp/scheduler';


const USER = `user:${USER_EXPLORER_APP_ID_PROVIDER}:${USER_EXPLORER_APP_NAME}`;


export function getCollectors({
	connection
} :{
	connection :RepoConnection | WriteConnection
}) {
	const collectors :{
		[taskDescriptor :string] :boolean
	}= {};
	queryCollectors({
		connection: connection as RepoConnection
	}).hits.forEach(({
		appName,
		collectTaskName
	} :{
		appName :Application.Key
		collectTaskName :TaskName
	}) => {
		collectors[`${appName}:${collectTaskName}` as TaskDescriptor] = true;
	});
	return collectors;
}


export function createOrModifyJobsFromCollectionNode({
	connection,
	collectors = getCollectors({connection}),
	collectionNode,
	timeZone = 'GMT+02:00' // CEST (Summer Time)
	//timeZone = 'GMT+01:00' // CET
} :{
	connection :WriteConnection
	collectors? :{
		[taskDescriptor :string] :boolean
	}
	collectionNode :CollectionWithCron // cron, // cron is no longer stored on the CollectionNode, but is passed in here from GraphQL mutation.
	timeZone :string
}) {
	//log.debug(`createOrModifyJobsFromCollectionNode collectionNode:${toStr(collectionNode)}`);
	const {
		_id: collectionNodeId,
		_name: collectionNodeName,
		//_path: collectionNodePath,
		collector: {
			name: collectorId,
			config: collectorConfig
		} = {},
		cron: cronMaybeArray,
		doCollect = false
	} = collectionNode;

	const jobPrefix = `${uniqueId({
		repoId: REPO_ID_EXPLORER,
		nodeId: collectionNodeId
	})}${DOT_SIGN}`;

	const existingJobs = listExplorerJobsThatStartWithName({name: jobPrefix});
	//log.debug(`createOrModifyJobsFromCollectionNode collection name:${collectionNodeName} existingJobs:${toStr(existingJobs)}`);

	if (!collectorId) {
		log.debug(`Collection with name:${collectionNodeName} is missing a collector! (which may be ok)`);
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
				collectionId: collectionNodeId,
				collectorId,
				configJson,
				name: collectionNodeName
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
