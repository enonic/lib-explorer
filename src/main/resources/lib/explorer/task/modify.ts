import type {WriteConnection} from '/lib/explorer/types/index.d';

import {
	TASK_STATE_FAILED,
	TASK_STATE_FINISHED,
	TASK_STATE_RUNNING,
	TASK_STATE_WAITING
} from '@enonic/js-utils';
import {modify as modifyNode} from '../node/modify';
import {
	SHOULD_RUN,
	SHOULD_STOP
} from './constants';


type TaskShould =
	| typeof SHOULD_RUN
	| typeof SHOULD_STOP

type TaskState =
	| typeof TASK_STATE_FAILED
	| typeof TASK_STATE_FINISHED
	| typeof TASK_STATE_RUNNING
	| typeof TASK_STATE_WAITING


export function modify({
	connection,
	should = SHOULD_RUN,
	state = TASK_STATE_RUNNING
} :{
	connection :WriteConnection,
	should? :TaskShould
	state? :TaskState
}) {
	return modifyNode({
		_name: '', // The repo root node
		should,
		state
	}, {
		connection
	});
}
