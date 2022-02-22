import type {
	ParentPath,
	Path,
	PermissionsParams
} from '/lib/explorer/types.d';


import {
	NT_FIELD,
	ROOT_PERMISSIONS_EXPLORER
} from '/lib/explorer/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function field({
	// Required
	key,

	// Optional
	/* eslint-disable no-unused-vars */
	_id, // avoid from ...rest
	_nodeType, // avoid from ...rest
	_path, // avoid from ...rest
	displayName, // avoid from ...rest
	/* eslint-enable no-unused-vars */
	_inheritsPermissions = false, // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
	_name = key,
	_parentPath = '/fields',
	_permissions = ROOT_PERMISSIONS_EXPLORER,

	description,
	fieldType = 'text',
	max = 0,
	min = 0,

	decideByType = true,
	enabled = true,
	nGram = true, // INDEX_CONFIG_N_GRAM
	fulltext = true,
	includeInAllText = true,
	path = false,
	...rest
} :{
	// Required
	key :string

	// Optional
	_id? :string
	_inheritsPermissions? :boolean
	_nodeType? :string
	_permissions? :Array<PermissionsParams>
	_path? :Path
	displayName? :string

	_name? :string
	_parentPath? :ParentPath

	description? :string
	fieldType? :string
	max? :number
	min? :number

	decideByType? :boolean
	enabled? :boolean
	nGram? :boolean
	fulltext? :boolean
	includeInAllText? :boolean
	path? :boolean
}) {
	return node({
		...rest,
		_indexConfig: {default: 'byType'},
		_inheritsPermissions,
		_name,
		_nodeType: NT_FIELD,
		_parentPath,
		_permissions,
		description,
		key,
		fieldType,
		max,
		min,
		indexConfig: {
			decideByType,
			enabled,
			nGram, // INDEX_CONFIG_N_GRAM
			fulltext,
			includeInAllText,
			path
		}
	});
} // field
