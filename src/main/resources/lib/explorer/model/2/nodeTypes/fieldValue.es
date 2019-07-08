import {NT_FIELD_VALUE} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
import {dirname} from '/lib/explorer/path/dirname';


export function fieldValue({
	_id, // avoid from ...rest
	_permissions, // avoid from ...rest
	_path, // avoid from ...rest, also used in default for _parentPath
	_parentPath = dirname(_path),
	_name,
	field,
	fieldReference,
	...rest
}) {
	if (!field) { throw new Error('field is a required parameter'); }
	if (!fieldReference) { throw new Error('fieldReference is a required parameter'); }
	return node({
		...rest,
		_parentPath,
		_name,
		_indexConfig: {default: 'byType'},
		field,
		fieldReference,
		type: NT_FIELD_VALUE
	});
} // fieldValue
