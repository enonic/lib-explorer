import type {NodeCreateParams} from '/lib/explorer/types/index.d';


import {ROOT_PERMISSIONS_EXPLORER} from '/lib/explorer/constants';


export function node<Node extends Omit<NodeCreateParams,'_name'> & {
	_name :string
}>({
	_childOrder, //= '_ts DESC',
	_indexConfig = {
		default: 'byType'
	},
	_inheritsPermissions = false, // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
	_manualOrderValue,
	_name,
	_nodeType = 'default',
	_parentPath = '/',
	_permissions = ROOT_PERMISSIONS_EXPLORER,
	...rest
} :Node ) :Node {
	if (!_name) { throw new Error('_name is a required parameter'); } // TODO _name is optional in repoConnection.create() simply becomes the generated _id
	return {
		_childOrder,
		_indexConfig,
		_inheritsPermissions,
		_manualOrderValue,
		_name,
		_nodeType,
		_parentPath,
		_permissions,
		...rest
	} as Node;
}
