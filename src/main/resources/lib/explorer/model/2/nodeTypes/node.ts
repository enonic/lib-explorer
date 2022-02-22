import type {
	IndexConfig,
	ParentPath,
	PermissionsParams
} from '/lib/explorer/types.d';
//import type {IndexConfigEntry} from '@enonic/js-utils/src/storage/indexing/IndexConfig.d';

import {ROOT_PERMISSIONS_EXPLORER} from '/lib/explorer/constants';


export function node<Node extends {
	_indexConfig :IndexConfig
	_inheritsPermissions? :boolean
	_name :string
	_nodeType? :string
	_parentPath? :ParentPath
	_permissions? :Array<PermissionsParams>
}>({
	_indexConfig = {
		default: 'byType'
	},
	_inheritsPermissions = false, // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
	_name,
	_nodeType = 'default',
	_parentPath = '/',
	_permissions = ROOT_PERMISSIONS_EXPLORER,
	...rest
} :Node ) :Node {
	if (!_name) { throw new Error('_name is a required parameter'); }
	return {
		_indexConfig,
		_inheritsPermissions,
		_name,
		_nodeType,
		_parentPath,
		_permissions,
		...rest
	} as Node;
}
