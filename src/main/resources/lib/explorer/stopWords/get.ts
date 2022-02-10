import type {
	Key,
	ParentPath,
	Path,
	RepoConnection
} from '/lib/explorer/types.d';
import type {StopwordNode} from './types.d';

//import {toStr} from '@enonic/js-utils';

import {join} from '/lib/explorer/path/join';
import {map} from '/lib/explorer/stopWords/map';

export function get({
	connection,
	id,
	parentPath = '/stopwords',
	name = '',
	path = join(parentPath, name) as Path,
	key = id || path
} :{
	connection :RepoConnection
	id :string
	parentPath? :ParentPath
	name? :string
	path? :Path
	key? :Key
}) {
	const node = connection.get(key) as StopwordNode;
	if (!node) { // Handle ghost nodes
		return null;
	}
	return map(node);
}
