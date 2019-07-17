import {get} from '/lib/explorer/node/get';


export function getField({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	_name
}) {
	//log.info(`_name:${_name}`);
	return get({
		connection,
		_parentPath: '/fields',
		_name
	});
}
