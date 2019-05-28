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
	decideByType = 'on',
	enabled = 'on',
	nGram = 'on',
	fulltext = 'on',
	includeInAllText = 'on',
	path,
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
			decideByType: decideByType && decideByType === 'on',
			enabled: enabled && enabled === 'on',
			nGram: nGram && nGram === 'on',
			fulltext: fulltext && fulltext === 'on',
			includeInAllText: includeInAllText && includeInAllText === 'on',
			path: path && path === 'on'
		} : instruction,
		type: NT_FIELD
	});
} // field
