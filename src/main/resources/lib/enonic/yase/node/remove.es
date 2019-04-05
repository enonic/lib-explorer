export function remove({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	_parentPath = '/',
	_name,
	path = `${_parentPath}${_name}`,
	key = path,
	keys = [key]
}) {
	return connection.delete(keys); // Array
}
