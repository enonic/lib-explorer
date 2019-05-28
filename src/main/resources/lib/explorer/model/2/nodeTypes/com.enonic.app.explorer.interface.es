import {
	NT_INTERFACE
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function interfaceModel({
	_id, // avoid from ...rest
	_path, // avoid from ...rest
	_permissions, // avoid from ...rest
	_parentPath = '/interfaces',
	...rest
}) {
	return node({
		...rest,
		_parentPath,
		_indexConfig: {default: 'byType'},
		type: NT_INTERFACE
	});
} // interfaceModel
