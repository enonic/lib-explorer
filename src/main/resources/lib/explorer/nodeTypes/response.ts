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
		//_inheritsPermissions = false
		_name,
		_parentPath,
		//_permissions // TODO Only superadmin and crawler should have access
		request,
		response,
		type: NT_RESPONSE,
		...rest
	};
}
