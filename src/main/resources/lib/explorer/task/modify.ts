import type { TaskStateType } from '/lib/xp/task';
import type {
	TaskShouldType,
	WriteConnection
} from '@enonic-types/lib-explorer';


import { TASK_STATE_RUNNING } from '@enonic/js-utils';
import {modify as modifyNode} from '/lib/explorer/node/modify';
import { SHOULD_RUN } from './constants';


export function modify({
	connection,
	should = SHOULD_RUN,
	state = TASK_STATE_RUNNING
} :{
	connection: WriteConnection,
	should?: TaskShouldType
	state?: TaskStateType
}) {
	return modifyNode({
		_name: '', // The repo root node
		should,
		state
	}, {
		connection
	});
}
