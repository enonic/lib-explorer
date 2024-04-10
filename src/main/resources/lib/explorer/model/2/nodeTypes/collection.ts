import type {ParentPath} from '@enonic-types/lib-explorer';
import type {CollectionNode} from '@enonic-types/lib-explorer/Collection.d';


import {
	NT_COLLECTION
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';

//@ts-ignore
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
	documentTypeId,
	...rest
} :CollectionNode & {
	displayName? :string
	_parentPath? :ParentPath
}) {
	const obj = {
		...rest,
		_indexConfig: {default: 'byType'},
		_nodeType: NT_COLLECTION,
		_parentPath,
		collector
	} as CollectionNode & {
		_parentPath :ParentPath
	};
	if (documentTypeId) {
		obj.documentTypeId = reference(documentTypeId);
	}
	//@ts-ignore
	return node(obj);
} // field
