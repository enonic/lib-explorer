import {
	NT_SYNONYM
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
import {dirname} from '/lib/explorer/path/dirname';


export function synonym({
	_id, // avoid from ...rest
	_permissions, // avoid from ...rest
	_path, // avoid from ...rest, also used in default for _parentPath
	_parentPath = dirname(_path),
	from,
	to,
	displayName = `${Array.isArray(from) ? from.join(', ') : from} => ${Array.isArray(to) ? to.join(', ') : to}`,
	...rest
}) {
	return node({
		...rest,
		_parentPath,
		_indexConfig: {default: 'byType'},
		from,
		to,
		type: NT_SYNONYM
	});
} // field
