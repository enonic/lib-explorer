//import {toStr} from '/lib/util';

import {join} from '/lib/enonic/yase/path/join';
import {map} from '/lib/enonic/yase/stopWords/map';

export function get({
	connection,
	id,
	parentPath = '/stopwords',
	name = '',
	path = join(parentPath, name),
	key = id || path
}) {
	const node = connection.get(key);
	if (!node) { // Handle ghost nodes
		return null;
	}
	return map(node);
}
