import type {CollectorTaskConfig} from '../types.d';
import type {CreateScheduledJobParams} from '/lib/xp/scheduler';

import {toStr} from '@enonic/js-utils';
import {detailedDiff} from 'deep-object-diff';
import deepEqual from 'fast-deep-equal';

// import HumanDiff from 'human-object-diff';
// import * as HumanDiff from 'human-object-diff'; // This fails when doing app-explorer development build

// @ts-ignore Import assignment cannot be used when targeting ECMAScript modules.
// import HumanDiff = require('human-object-diff');


import {
	USER_EXPLORER_APP_NAME,
	USER_EXPLORER_APP_ID_PROVIDER
} from '/lib/explorer/model/2/constants';
import {
	create as createJob,
	get as getJob,
	modify as modifyJob
} from '/lib/xp/scheduler';


// const { diff: diffJob } = new HumanDiff({
// 	objectName: 'job'
// });

const USER = `user:${USER_EXPLORER_APP_ID_PROVIDER}:${USER_EXPLORER_APP_NAME}`;


export function createOrModifyJob({
	config,
	descriptor,
	enabled = true,
	name,
	schedule,
	user = USER
}: {
	config: CollectorTaskConfig
	descriptor: string
	enabled?: boolean
	name: string
	schedule: CreateScheduledJobParams<CollectorTaskConfig>['schedule']
	user?: CreateScheduledJobParams<CollectorTaskConfig>['user']
}) {
	const paramsObj = {
		config,
		descriptor,
		enabled,
		name,
		schedule,
		user
	};
	const maybeExisitingJob = getJob({name});
	if (maybeExisitingJob) {

		// So deepEqual won't compare these:
		delete maybeExisitingJob.modifier;
		delete maybeExisitingJob.modifiedTime;

		if (deepEqual(maybeExisitingJob, paramsObj)) {
			log.debug(`No changes detected, not updating job with name:${name}`);
		} else {
			log.info(`Changes detected in job with name:${name} diff:${toStr(detailedDiff(maybeExisitingJob, paramsObj))}`);
			// log.info(`Changes detected in job with name:${name} diff:${toStr(diffJob(maybeExisitingJob, paramsObj))}`);
			const modifiedJob = modifyJob<CollectorTaskConfig>({
				name,
				editor: (exisitingJob) => {
					// log.info(`exisitingJob:${toStr(exisitingJob)}`);
					exisitingJob.config = config;
					exisitingJob.descriptor = descriptor;
					exisitingJob.enabled = enabled;
					exisitingJob.schedule = schedule;
					exisitingJob.user = user;
					// exisitingJob.modifiedTime = new Date(); // Needed?
					return exisitingJob;
				}
			});
			// log.info(`modifiedJob:${toStr(modifiedJob)}`);
			return modifiedJob;
		}
	} else { // Job doesn't exist
		const createdJob = createJob<CollectorTaskConfig>(paramsObj);
		// log.info(`createdJob:${toStr(createdJob)}`);
		return createdJob;
	}
}
