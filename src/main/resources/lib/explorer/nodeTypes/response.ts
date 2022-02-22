import {ROOT_PERMISSIONS_EXPLORER} from '/lib/explorer/constants';
import {NT_RESPONSE} from '/lib/explorer/model/2/constants';


export function response ({
	_parentPath = '/',
	_name,
	request,
	response,
	...rest
}) {
	return {
		_indexConfig: {
			default: 'none',
			configs: [{/*
				path: 'request',
				config: 'none'
			},{
				path: 'response',
				config: 'none'
			},{*/
				path: 'type',
				config: 'minimal'
			}]
		},
		_inheritsPermissions: false, // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
		_name,
		_parentPath,
		_permissions: ROOT_PERMISSIONS_EXPLORER,
		request,
		response,
		type: NT_RESPONSE,
		...rest
	};
}
