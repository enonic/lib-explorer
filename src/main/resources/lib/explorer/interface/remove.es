import {INTERFACES_FOLDER} from '/lib/explorer/model/2/index';
import {remove as removeNode} from '/lib/explorer/node/remove';


export function remove({
	connection,
	name
}) {
	return removeNode({
		connection,
		_parentPath: `/${INTERFACES_FOLDER}`,
		_name: name
	});
}
