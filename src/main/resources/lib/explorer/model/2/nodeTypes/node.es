export function node({
	_parentPath = '/',
	_name,
	_indexConfig = {
		default: 'byType'
	},
	...rest
}) {
	if (!_name) { throw new Error('_name is a required parameter'); }
	return {
		_parentPath,
		_name,
		_indexConfig,
		...rest
	};
}
