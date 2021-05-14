import {
	NT_SYNONYM
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
import {dirname} from '/lib/explorer/path/dirname';


export function synonym({
	/* eslint-disable no-unused-vars */
	_id, // avoid from ...rest
	_permissions, // avoid from ...rest
	_path, // avoid from ...rest, also used in default for _parentPath
	displayName, // avoid from ...rest
	/* eslint-enable no-unused-vars */
	_parentPath = dirname(_path),
	from,
	to,
	//displayName = `${Array.isArray(from) ? from.join(', ') : from} => ${Array.isArray(to) ? to.join(', ') : to}`,
	...rest
}) {
	return node({
		...rest,
		_indexConfig: {default: 'byType'},
		_nodeType: NT_SYNONYM,
		_parentPath,
		from,
		to
	});
} // field
