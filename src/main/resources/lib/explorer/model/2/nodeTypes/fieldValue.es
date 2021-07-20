import {
	//toStr,
	ucFirst
} from '@enonic/js-utils';

import {NT_FIELD_VALUE} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
//import {dirname} from '/lib/explorer/path/dirname';


export function fieldValue({
	/* eslint-disable no-unused-vars */
	_id, // avoid from ...rest
	_permissions, // avoid from ...rest
	_path, // avoid from ...rest
	/* eslint-enable no-unused-vars */
	field,
	//_parentPath = dirname(_path),
	_parentPath = `/fields/${field}`,
	fieldReference,
	value,
	_name = value,
	displayName = ucFirst(_name),
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
		_indexConfig: {default: 'byType'},
		_name,
		_nodeType: NT_FIELD_VALUE,
		_parentPath,
		displayName,
		field,
		fieldReference,
		value
	});
} // fieldValue
