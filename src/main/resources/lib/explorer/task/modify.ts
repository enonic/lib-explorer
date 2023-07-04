import type { TaskStateType } from '/lib/xp/task';
import type {
	TaskShouldType,
	WriteConnection
} from '/lib/explorer/types/index.d';


import { TASK_STATE_RUNNING } from '@enonic/js-utils';
import {modify as modifyNode} from '../node/modify';
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
