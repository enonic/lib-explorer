import type {RepoConnection} from '/lib/xp/node';


import { Folder } from '@enonic/explorer-utils';
import {remove as removeNode} from '/lib/explorer/node/remove';


export function remove({
	connection,
	name
}: {
	connection: RepoConnection
	name: string
}) {
	return removeNode({
		connection,
		_parentPath: `/${Folder.INTERFACES}`,
		_name: name
	});
}
