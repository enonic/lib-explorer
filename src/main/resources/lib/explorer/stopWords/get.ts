import type {
	Key,
	ParentPath,
	Path,
	RepoConnection,
	StopwordNode,
} from '@enonic-types/lib-explorer';

// import {toStr} from '@enonic/js-utils';
import {join} from '/lib/explorer/path/join';
import {coerseStopWordType} from '/lib/explorer/stopWords/coerseStopWordType';


export function get({
	connection,
	id,
	parentPath = '/stopwords',
	name = '',
	path = join(parentPath, name) as Path,
	key = id || path
} :{
	connection: RepoConnection
	id?: string
	parentPath?: ParentPath
	name?: string
	path?: Path
	key?: Key
}) {
	const node = connection.get(key) as StopwordNode;
	if (!node) { // Handle ghost nodes
		return null;
	}
	return coerseStopWordType(node);
}
