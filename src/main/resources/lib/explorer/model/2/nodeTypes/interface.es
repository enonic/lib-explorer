import {
	NT_INTERFACE
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
import {ucFirst} from '/lib/explorer/ucFirst';


export function interfaceModel({
	/* eslint-disable no-unused-vars */
	_id, // avoid from ...rest
	_path, // avoid from ...rest
	_permissions, // avoid from ...rest
	/* eslint-enable no-unused-vars */
	_name,
	_parentPath = '/interfaces',
	displayName = ucFirst(_name),
	...rest
}) {
	return node({
		...rest,
		_indexConfig: {
			default: 'byType',
			configs: [{
				path: 'resultMappings*',
				config: 'none'
			}]
		},
		_name,
		_nodeType: NT_INTERFACE,
		_parentPath,
		displayName
	});
} // interfaceModel
