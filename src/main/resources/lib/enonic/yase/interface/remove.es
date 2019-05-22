import {remove as removeNode} from '/lib/enonic/yase/node/remove';


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
