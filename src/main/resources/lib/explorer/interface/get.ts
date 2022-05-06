import type {
	InterfaceNode,
	RepoConnection
} from '/lib/explorer/types/index.d';


import {INTERFACES_FOLDER} from '/lib/explorer/constants';


export function get({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	interfaceName,
	key = `/${INTERFACES_FOLDER}/${interfaceName}`
} :{
	connection :RepoConnection,
	interfaceName ?:string
	key? :string
}) :InterfaceNode {
	return connection.get<InterfaceNode>(key) as InterfaceNode;
}
