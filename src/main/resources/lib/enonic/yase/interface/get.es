export function get({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	interfaceName,
	key = `/interfaces/${interfaceName}`
}) {
	return connection.get(key)
}
