import {modify as modifyNode} from '/lib/enonic/yase/node/modify';


export function modify({
	connection,
	should = 'RUN',
	state = 'RUNNING'
}) {
	return modifyNode({
		__connection: connection,
		_name: '', // The repo root node
		should,
		state
	});
}
