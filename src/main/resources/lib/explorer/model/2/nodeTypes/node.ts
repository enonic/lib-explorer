import type {ParentPath} from '/lib/explorer-typescript/types.d';
//import type {IndexConfigEntry} from '@enonic/js-utils/src/storage/indexing/IndexConfig.d';
import type {IndexConfig} from '/lib/explorer-typescript/types/IndexConfig.d';


export function node<Node extends {
	_indexConfig :IndexConfig
	_name :string
	_nodeType? :string
	_parentPath? :ParentPath
}>({
	_parentPath = '/',
	_name,
	_nodeType = 'default',
	_indexConfig = {
		default: 'byType'
	},
	...rest
} :Node ) :Node {
	if (!_name) { throw new Error('_name is a required parameter'); }
	return {
		_parentPath,
		_name,
		_nodeType,
		_indexConfig,
		...rest
	} as Node;
}
