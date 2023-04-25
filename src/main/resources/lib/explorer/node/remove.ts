import type {RepoConnection} from '/lib/xp/node';


//import {toStr} from '@enonic/js-utils';
import {join} from '/lib/explorer/path/join';


export function remove({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	_parentPath = '/',
	_name = '',
	path = join(_parentPath, _name),
	key = path,
	keys = [key]
}: {
	_name?: string
	_parentPath?: string
	connection: RepoConnection
	path?: string
	key?: string
	keys?: string[]
}) {
	// log.info('keys:%s', toStr(keys));
	const res = connection.delete(keys); // Array
	connection.refresh();
	return res;
}
