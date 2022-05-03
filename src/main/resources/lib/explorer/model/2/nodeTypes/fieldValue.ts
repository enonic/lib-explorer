import type {
	Id,
	//IndexConfig,
	Name,
	Path,
	ParentPath
} from '/lib/explorer/types/index.d';
import type {PermissionsParams} from '/lib/explorer/types.d';

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
} :{
	_id :Id
	_name :Name
	_path :Path
	_permissions :Array<PermissionsParams>
	field :string
	fieldReference :string
	value :string
	// Optional
	_parentPath? :ParentPath
	displayName? :string
}) {
	log.warning('model/2/nodeTypes/fieldValue() was deprecated in lib-explorer-4.0.0'); // TODO Throw error in lib-explorer-5.0.0 and remove in lib-explorer-6.0.0
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
