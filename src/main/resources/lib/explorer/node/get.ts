//import {toStr} from '@enonic/js-utils';

import {join}  from '/lib/explorer/path/join';


export const get = ({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	_parentPath = '/',
	_name = '',
	path = join(_parentPath, _name),
	key = path,
	keys = [key]
}) => {
	/*log.info(toStr({
		_parentPath,
		_name,
		path,
		key,
		keys
	}));*/
	return connection.get(...keys);
}; // get
