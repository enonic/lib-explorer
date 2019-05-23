import {
	NT_FIELD
} from '/lib/explorer/constants';
import {ucFirst} from '/lib/explorer/ucFirst';


export const field = ({
	key,
	_name = key,
	displayName = ucFirst(_name),

	//description,
	//iconUrl,

	fieldType = 'text',

	instruction = 'type',
	decideByType = 'on',
	enabled = 'on',
	nGram = 'on',
	fulltext = 'on',
	includeInAllText = 'on',
	path,

	...rest // __connection
}) => ({
	...rest, // __connection
	_indexConfig: {default: 'byType'},
	_parentPath: '/fields',
	_name,
	displayName,
	key,

	//description,
	//iconUrl,

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
