import {
	NT_THESAURUS
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
import {ucFirst} from '/lib/explorer/ucFirst';


export function thesaurus({
	_name,
	_parentPath = '/thesauri',
	description,
	displayName = ucFirst(_name), // TODO remove?
	...rest
}) {
	delete rest._id;
	delete rest._path;
	delete rest._permissions;
	return node({
		...rest,
		_indexConfig: {default: 'byType'},
		_name,
		_nodeType: NT_THESAURUS,
		_parentPath,
		description,
		displayName // TODO remove?
	});
} // field
