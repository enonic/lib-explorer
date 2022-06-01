import type {RepoConnection} from '/lib/explorer/types/index.d';


import {
	TASK_STATE_FAILED,
	TASK_STATE_FINISHED,
	TASK_STATE_RUNNING,
	TASK_STATE_WAITING//,
	//toStr
} from '@enonic/js-utils';
import {get as getNode} from '../node/get';
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


export function get({
	connection
} :{
	connection :RepoConnection
}) {
	const node = getNode<{
		should :TaskShould,
		state :TaskState
	}>({
		connection,
		_name: '' // The repo root node
	});
	//log.info(toStr({node}));
	const {should, state} = node;
	//log.info(toStr({should, state}));
	return {should, state};
}
