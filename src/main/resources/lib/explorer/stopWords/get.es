//import {toStr} from '@enonic/js-utils';

import {join} from '/lib/explorer/path/join';
import {map} from '/lib/explorer/stopWords/map';

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
