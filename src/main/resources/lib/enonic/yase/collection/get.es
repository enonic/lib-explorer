//import {toStr} from '/lib/enonic/util';
import {connectRepo} from '/lib/enonic/yase/connectRepo';


export const get = ({
	connection = connectRepo(),
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
