import {NT_SYNONYM} from '/lib/enonic/yase/constants';


export const synonym = ({
	_parentPath,
	from,
	to,
	displayName = `${Array.isArray(from) ? from.join(', ') : from} => ${Array.isArray(to) ? to.join(', ') : to}`
}) => ({
	_parentPath,
	_name: displayName,
	_indexConfig: {
		default: 'byType'
	},
	displayName,
	from,
	to,
	type: NT_SYNONYM
});