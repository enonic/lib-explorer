//import {toStr} from '/lib/enonic/util';
import {connect} from '/lib/enonic/yase/repo/connect';


export const get = ({
	connection = connect(),
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
