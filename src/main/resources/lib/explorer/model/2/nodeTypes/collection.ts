// import type {Reference} from '@enonic-types/lib-value';
import type {ParentPath} from '@enonic-types/lib-explorer';
import type {CollectionNode} from '@enonic-types/lib-explorer/Collection.d';


import {indexTemplateToConfig} from '@enonic/js-utils/storage';
import {
	NT_COLLECTION
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
import {reference} from '/lib/xp/value';


type CleanedCollectionNodeWithParentPath = Omit<CollectionNode,
	'_id'
	| '_parentPath'
	| '_path'
	| '_permissions'
> & {
	_parentPath: ParentPath
};


export function collection({
	_id, // avoid from ...rest
	_path, // avoid from ...rest
	_permissions, // avoid from ...rest
	displayName, // avoid from ...rest
	_parentPath = '/collections',
	collector,
	documentTypeId,
	...rest
}: Omit<CollectionNode, '_parentPath'> & {
	displayName?: string
	_parentPath?: ParentPath
}) {
	const obj: CleanedCollectionNodeWithParentPath = {
		...rest,
		_indexConfig: {
			default: indexTemplateToConfig({
				template:'byType'
			}),
			configs: [],
		},
		_nodeType: NT_COLLECTION,
		_parentPath,
		collector
	};
	if (documentTypeId) {
		obj.documentTypeId = reference(documentTypeId.toString());
	}
	//@ts-ignore
	return node(obj);
} // field
