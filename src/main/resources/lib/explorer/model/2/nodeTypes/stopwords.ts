import type {
	IndexConfig,
	Name,
	ParentPath
} from '@enonic-types/lib-explorer';


import {
	NT_STOP_WORDS,
	INDEX_CONFIG_STOP_WORDS
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
import {ucFirst} from '/lib/explorer/ucFirst';


export function stopwords({
	_name,
	_parentPath = '/stopwords',
	displayName = ucFirst(_name), // TODO remove?
	words,
	...rest
} :{
	_name :Name
	_parentPath? :ParentPath
	displayName? :string
	words :Array<string>|string
}) {
	delete rest['_id'];
	delete rest['_path'];
	delete rest['_permissions'];
	return node({
		...rest,
		_indexConfig: INDEX_CONFIG_STOP_WORDS as IndexConfig,
		_name,
		_nodeType: NT_STOP_WORDS,
		_parentPath,
		displayName, // TODO remove?
		words
	});
} // field
