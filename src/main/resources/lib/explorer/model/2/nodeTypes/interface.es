import {
	INTERFACES_FOLDER,
	NT_INTERFACE
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function interfaceModel({
	/* eslint-disable no-unused-vars */
	_id, // avoid from ...rest
	_path, // avoid from ...rest
	_permissions, // avoid from ...rest
	/* eslint-enable no-unused-vars */
	_name,

	// NOTE: _parentPath is a parameter when creating a node, used in _path
	// Since it is not stored it creates diffing issues...
	_parentPath = `/${INTERFACES_FOLDER}`,

	...rest
}) {
	return node({
		...rest,
		_indexConfig: {
			default: {
				decideByType: true,
				enabled: true,
				nGram: false,
				fulltext: false,
				includeInAllText: false,
				path: false,
				indexValueProcessors: [],
				languages: []
			}
		},
		_name,
		_nodeType: NT_INTERFACE,
		_parentPath
	});
} // interfaceModel
