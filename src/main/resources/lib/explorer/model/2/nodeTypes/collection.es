import {
	NT_COLLECTION
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
import {reference} from '/lib/xp/value';

export function collection({
	/* eslint-disable no-unused-vars */
	_id, // avoid from ...rest
	_path, // avoid from ...rest
	_permissions, // avoid from ...rest
	displayName, // avoid from ...rest
	/* eslint-enable no-unused-vars */
	_parentPath = '/collections',
	collector,
	schemaId,
	...rest
}) {
	const obj = {
		...rest,
		_indexConfig: {default: 'byType'},
		_nodeType: NT_COLLECTION,
		_parentPath,
		collector
	};
	if (schemaId) {
		obj.schemaId = reference(schemaId);
	}
	return node(obj);
} // field
