//import {toStr} from '@enonic/js-utils';


const PATH_COLLECTIONS = '/collections/';


export const get = ({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	//debug = false,
	name,
	key = `${PATH_COLLECTIONS}${name}`,
	keys = Array.isArray(name)
		? name.map(n => `${PATH_COLLECTIONS}${n}`)
		: key
}) => {
	//if (debug) { log.debug(`keys:${toStr({keys})}`); }
	const res = connection.get(keys);
	//if (debug) { log.debug(`res:${toStr({res})}`); }
	return res;
};
