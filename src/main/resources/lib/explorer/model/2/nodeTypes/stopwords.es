import {
	NT_STOP_WORDS,
	INDEX_CONFIG_STOP_WORDS
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function stopwords({
	_parentPath = '/stopwords',
	words,
	...rest
}) {
	delete rest._id;
	delete rest._path;
	delete rest._permissions;
	return node({
		...rest,
		_parentPath,
		_indexConfig: INDEX_CONFIG_STOP_WORDS,
		type: NT_STOP_WORDS,
		words
	});
} // field
