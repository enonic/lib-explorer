//import {toStr} from '@enonic/js-utils';

const PATH_COLLECTIONS = '/collections/';

export const get = ({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	name,
	key = `${PATH_COLLECTIONS}${name}`,
	keys = Array.isArray(name)
		? name.map(n => `${PATH_COLLECTIONS}${n}`)
		: key
}) => {
	//log.info(toStr({keys}));
	const res = connection.get(keys);
	//log.info(toStr({res}));
	return res;
};
