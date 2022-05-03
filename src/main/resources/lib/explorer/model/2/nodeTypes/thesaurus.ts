import type {
	Name,
	ParentPath,
	IndexConfigConfig
} from '/lib/explorer/types/index.d';

import {
	NT_THESAURUS
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function thesaurus({
	_name,
	_parentPath = '/thesauri',

	// Expected, but covered by ...rest
	/*description,
	language = {
		from: '',
		to: ''
	},*/

	...rest
} :{
	_name :Name
	_parentPath :ParentPath
}) {
	delete rest['_id'];
	delete rest['_path'];
	delete rest['_permissions'];
	return node({
		...rest,
		_indexConfig: {
			default: 'byType' as IndexConfigConfig
		},
		_name,
		_nodeType: NT_THESAURUS,
		_parentPath/*,
		description,
		language*/
	});
} // field
