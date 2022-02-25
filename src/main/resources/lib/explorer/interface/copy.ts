import type {WriteConnection} from '../node/WriteConnection.d';
import type {InterfaceCreateParams} from './types.d';


import {INTERFACES_FOLDER} from '/lib/explorer/index';
import {exists} from '/lib/explorer/interface/exists';
import {get} from '/lib/explorer/interface/get';
import {create} from '/lib/explorer/node/create';


export function copy({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	from,
	to
} :{
	connection :WriteConnection
	from :string
	to :string
}) {
	if (!from) {
		throw new Error('Missing required parameter from!');
	}

	if (!to) {
		throw new Error('Missing required parameter to!');
	}

	if (exists({
		connection,
		name: to
	})) {
		throw new Error(`Cannot copy interface ${from} to ${to}. To already exists!`);
	}

	const interfaceNode = get({
		connection,
		interfaceName: from
	}) as InterfaceCreateParams;
	if (!interfaceNode) {
		throw new Error(`Cannot copy interface ${from} to ${to}. From doesn't exist!`);
	}

	interfaceNode._id = undefined;
	interfaceNode._parentPath = `/${INTERFACES_FOLDER}`;
	interfaceNode._name = to;
	//creator
	//createdTime
	//modifiedTime


	const newNode = create(interfaceNode, {connection});
	if(!newNode) {
		throw new Error(`Something went wrong when trying to copy interface ${from} to ${to}!`);
	}
}
