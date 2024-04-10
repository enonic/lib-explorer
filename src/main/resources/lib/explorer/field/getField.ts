import type {
	FieldNode,
	RepoConnection
} from '@enonic-types/lib-explorer';


import {get} from '/lib/explorer/node/get';


const PATH_FIELDS = '/fields';


export function getField({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	_name,
	key = `${PATH_FIELDS}/${_name}`
} :{
	connection :RepoConnection
	_name ?:string
	key ?:string
}) {
	//log.info(`_name:${_name}`);
	return get<FieldNode>({
		connection,
		key
	});
}
