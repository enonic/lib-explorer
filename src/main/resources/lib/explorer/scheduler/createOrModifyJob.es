import {detailedDiff} from 'deep-object-diff';
import deepEqual from 'fast-deep-equal';

import {
	USER_EXPLORER_APP_NAME,
	USER_EXPLORER_APP_ID_PROVIDER
} from '/lib/explorer/model/2/constants';
import {toStr} from '/lib/util';
import {
	create as createJob,
	get as getJob,
	modify as modifyJob
} from '/lib/xp/scheduler';


const USER = `user:${USER_EXPLORER_APP_ID_PROVIDER}:${USER_EXPLORER_APP_NAME}`;


export function createOrModifyJob({
	config,
	descriptor,
	enabled = true,
	name,
	schedule,
	user = USER
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
		if (deepEqual(maybeExisitingJob, paramsObj)) {
			log.debug(`No changes detected, not updating job with name:${name}`);
		} else {
			log.info(`Changes detected in job with name:${name} diff:${toStr(detailedDiff(maybeExisitingJob, paramsObj))}`);
			const modifiedJob = modifyJob({
				name,
				editor: (exisitingJob) => {
					//log.info(`exisitingJob:${toStr(exisitingJob)}`);
					exisitingJob.config = config;
					exisitingJob.descriptor = descriptor;
					exisitingJob.enabled = enabled;
					exisitingJob.schedule = schedule;
					exisitingJob.user = user;
					return exisitingJob;
				}
			});
			//log.info(`modifiedJob:${toStr(modifiedJob)}`);
			return modifiedJob;
		}
	} else { // Job doesn't exist
		const createdJob = createJob(paramsObj);
		//log.info(`createdJob:${toStr(createdJob)}`);
		return createdJob;
	}
}
