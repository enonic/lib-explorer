import {modify as modifyNode} from '/lib/explorer/node/modify';


export function modify({
	connection,
	should = 'RUN',
	state = 'RUNNING'
}) {
	return modifyNode({
		_name: '', // The repo root node
		should,
		state
	}, {
		connection
	});
}
