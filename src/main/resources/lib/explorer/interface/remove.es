import {remove as removeNode} from '/lib/explorer/node/remove';


export function remove({
	connection,
	name
}) {
	return removeNode({
		connection,
		_parentPath: '/interfaces',
		_name: name
	});
}
