import {NT_FIELD} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function field({
	_id, // avoid from ...rest
	_permissions, // avoid from ...rest
	_path, // avoid from ...rest
	key,
	_name = key,
	_parentPath = '/fields',

	fieldType = 'text',

	instruction = 'type',
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
		_parentPath,
		_name,
		_indexConfig: {default: 'byType'},
		key,
		fieldType,
		indexConfig: instruction === 'custom' ? {
			decideByType,
			enabled,
			nGram,
			fulltext,
			includeInAllText,
			path
		} : instruction,
		type: NT_FIELD
	});
} // field
