import {ucFirst} from '/lib/explorer/ucFirst';


export function node({
	_parentPath = '/',
	_name,
	_indexConfig = {
		default: 'byType'
	},
	displayName = ucFirst(_name),
	...rest
}) {
	if (!_name) { throw new Error('_name is a required parameter'); }
	return {
		_parentPath,
		_name,
		_indexConfig,
		displayName,
		...rest
	};
};
