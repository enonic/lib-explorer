import {NT_RESPONSE} from '/lib/enonic/yase/constants';


export const response = ({
	_parentPath = '/',
	_name,
	request,
	response
}) => ({
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
	type: NT_RESPONSE
});
