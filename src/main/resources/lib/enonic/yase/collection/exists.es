import {get} from '/lib/enonic/yase/collection/get';


export function exists({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	name
}) {
	return !!get({connection, name});
}
