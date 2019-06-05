import {exists} from '/lib/explorer/interface/exists';
import {get} from '/lib/explorer/interface/get';
import {ucFirst} from '/lib/explorer/ucFirst';
import {create} from '/lib/explorer/node/create';


export function copy({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	from,
	to
}) {
	if (!from) {
		throw new Error('Missing required parameter from!')
	}

	if (!to) {
		throw new Error('Missing required parameter to!')
	}

	if (exists({
		connection,
		name: to
	})) {
		throw new Error(`Cannot copy interface ${from} to ${to}. To already exists!`);
	}

	const node = get({
		connection,
		interfaceName: from
	});
	if (!node) {
		throw new Error(`Cannot copy interface ${from} to ${to}. From doesn't exist!`);
	}

	node.__connection = connection; // eslint-disable-line no-underscore-dangle
	node._id = undefined;
	node._parentPath = '/interfaces';
	node._name = to;
	node.displayName = ucFirst(to);
	//creator
	//createdTime
	//modifiedTime


	const newNode = create(node);
	if(!newNode) {
		throw new Error(`Something went wrong when trying to copy interface ${from} to ${to}!`);
	}
}