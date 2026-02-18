import type { TaskStateType } from '@enonic-types/lib-task';
import type { TaskShouldType } from '../types/Task.d';
import type { WriteConnection } from '../types/WriteConnection.d';


import { TASK_STATE_RUNNING } from '@enonic/js-utils';
import { modify as modifyNode } from '/lib/explorer/node/modify';
import { SHOULD_RUN } from './constants';

export interface ModifyTaskParams {
	connection: WriteConnection;
	should?: TaskShouldType;
	state?: TaskStateType;
}

export function modify({
	connection,
	should = SHOULD_RUN,
	state = TASK_STATE_RUNNING
}: ModifyTaskParams) {
	return modifyNode({
		_name: '', // The repo root node
		should,
		state
	}, {
		connection
	});
}
