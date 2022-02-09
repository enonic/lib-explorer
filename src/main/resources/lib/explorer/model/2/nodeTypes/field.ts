import type {
	ParentPath,
	Path
} from '/lib/explorer-typescript/types.d';


import {NT_FIELD} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function field({
	/* eslint-disable no-unused-vars */
	_id, // avoid from ...rest
	_permissions, // avoid from ...rest
	_path, // avoid from ...rest
	displayName, // avoid from ...rest
	/* eslint-enable no-unused-vars */
	key,
	_name = key,
	_parentPath = '/fields',

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
	_id? :string
	_permissions? :unknown
	_path? :Path
	displayName? :string

	key :string
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
		_name,
		_nodeType: NT_FIELD,
		_parentPath,
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
