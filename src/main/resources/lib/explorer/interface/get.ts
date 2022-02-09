import {INTERFACES_FOLDER} from '/lib/explorer/model/2/index';


export function get({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	interfaceName,
	key = `/${INTERFACES_FOLDER}/${interfaceName}`
}) {
	return connection.get(key);
}
