import type {
	ParentPath,
	RepoConnection
} from '/lib/explorer/types/index.d';


//import {toStr} from '@enonic/js-utils';
import {join}  from '/lib/explorer/path/join';


export function get<T>({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	_parentPath = '/',
	_name = '',
	path = join(_parentPath, _name),
	key = path,
	keys = [key]
} :{
	connection :RepoConnection
	_name ?:string
	_parentPath ?:ParentPath
	path ?:string
	key ?:string
	keys ?:Array<string>
}) {
	/*log.info(toStr({
		_parentPath,
		_name,
		path,
		key,
		keys
	}));*/
	return connection.get<T>(...keys);
}; // get
