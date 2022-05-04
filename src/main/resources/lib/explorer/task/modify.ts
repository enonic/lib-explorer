import type {WriteConnection} from '/lib/explorer/types/index.d';


import {modify as modifyNode} from '../node/modify';


export function modify({
	connection,
	should = 'RUN',
	state = 'RUNNING'
} :{
	connection :WriteConnection,
	should? :string
	state? :string
}) {
	return modifyNode({
		_name: '', // The repo root node
		should,
		state
	}, {
		connection
	});
}
