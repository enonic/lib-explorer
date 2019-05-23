//import {toStr} from '/lib/util';
import {reference} from '/lib/xp/value';
import {join}  from '/lib/enonic/yase/path/join';


export function getReference({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	_parentPath = '/',
	_name = '',
	path = join(_parentPath, _name),
	key = path,
	keys = [key]
}) {
	//log.info(toStr({_parentPath, _name, path, key, keys}));
	const res = connection.get(...keys);
	if (Array.isArray(res)) {
		return res.map(({_id}) => reference(_id));
	}
	return reference(res._id);
}
