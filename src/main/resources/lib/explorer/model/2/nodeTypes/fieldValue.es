//import {toStr} from '/lib/util';

import {NT_FIELD_VALUE} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
import {dirname} from '/lib/explorer/path/dirname';


export function fieldValue({
	_id, // avoid from ...rest
	_permissions, // avoid from ...rest
	_path, // avoid from ...rest
	field,
	//_parentPath = dirname(_path),
	_parentPath = `/fields/${field}`,
	fieldReference,
	value,
	_name = value,
	...rest
}) {
	/*log.info(toStr({
		field,
		fieldReference,
		_parentPath,
		value,
		_name,
		rest
	}));*/
	if (!field) { throw new Error('field is a required parameter'); }
	if (!fieldReference) { throw new Error('fieldReference is a required parameter'); }
	if (!value) { throw new Error('value is a required parameter'); }
	return node({
		...rest,
		_parentPath,
		_name,
		_indexConfig: {default: 'byType'},
		field,
		fieldReference,
		type: NT_FIELD_VALUE,
		value
	});
} // fieldValue
