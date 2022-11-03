import type {RepoConnection} from '/lib/xp/node';


import {get} from '/lib/explorer/collection/get';


export function exists({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	name
} :{
	connection: RepoConnection
	name: string
}) {
	return !!get({connection, name});
}
