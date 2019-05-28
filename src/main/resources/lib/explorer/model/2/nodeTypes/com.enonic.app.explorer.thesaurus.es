import {
	NT_THESAURUS
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function thesaurus({
	_parentPath = '/thesauri',
	description,
	...rest
}) {
	delete rest._id;
	delete rest._path;
	delete rest._permissions;
	return node({
		...rest,
		_parentPath,
		_indexConfig: {default: 'byType'},
		type: NT_THESAURUS,
		description
	});
} // field
