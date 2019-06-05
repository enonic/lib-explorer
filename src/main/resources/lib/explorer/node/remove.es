//import {toStr} from '/lib/util';
import {join} from '/lib/explorer/path/join';



export function remove({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	_parentPath = '/',
	_name,
	path = join(_parentPath, _name),
	key = path,
	keys = [key]
}) {
	//log.info(toStr({keys}));
	const res = connection.delete(keys); // Array
	connection.refresh();
	return res;
}