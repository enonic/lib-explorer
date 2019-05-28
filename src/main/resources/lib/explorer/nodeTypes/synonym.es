import {NT_SYNONYM} from '/lib/explorer/model/2/constants';


export const synonym = ({
	_parentPath,
	from,
	to,
	displayName = `${Array.isArray(from) ? from.join(', ') : from} => ${Array.isArray(to) ? to.join(', ') : to}`,
	...rest // __connection
}) => ({
	_parentPath,
	_name: displayName,
	_indexConfig: {
		default: 'byType'
	},
	displayName,
	from,
	to,
	type: NT_SYNONYM,
	...rest // __connection
});
