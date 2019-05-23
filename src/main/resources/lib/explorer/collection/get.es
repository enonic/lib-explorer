//import {toStr} from '/lib/util';


export const get = ({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	name
}) => {
	const keys = Array.isArray(name)
		? name.map(n => `/collections/${n}`)
		: `/collections/${name}`;
	//log.info(toStr({keys}));
	const res = connection.get(keys);
	//log.info(toStr({res}));
	return res;
};
