import {join}  from '/lib/enonic/yase/path/join';


export function getId({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	_parentPath = '/',
	_name,
	path = join(_parentPath, _name),
	key = path,
	keys = [key]
}) {
	const res = connection.get(...keys);
	if (Array.isArray(res)) {
		return res.map(({_id}) => _id);
	}
	return res._id;
}
