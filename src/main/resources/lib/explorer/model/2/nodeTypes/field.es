import {NT_FIELD} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function field({
	/* eslint-disable no-unused-vars */
	_id, // avoid from ...rest
	_permissions, // avoid from ...rest
	_path, // avoid from ...rest
	displayName, // avoid from ...rest
	/* eslint-enable no-unused-vars */
	key,
	_name = key,
	_parentPath = '/fields',

	fieldType = 'text',

	decideByType = true,
	enabled = true,
	nGram = true,
	fulltext = true,
	includeInAllText = true,
	path = false,
	...rest
}) {
	return node({
		...rest,
		_indexConfig: {default: 'byType'},
		_name,
		_nodeType: NT_FIELD,
		_parentPath,
		key,
		fieldType,
		indexConfig: {
			decideByType,
			enabled,
			nGram,
			fulltext,
			includeInAllText,
			path
		}
	});
} // field
