import {NT_FIELD} from '../constants';
import {node} from './node';


export function field({
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
	path
}) {
	return node({
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
