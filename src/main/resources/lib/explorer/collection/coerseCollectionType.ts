import type {
	Collection,
	CollectionNode
} from '/lib/explorer/types/index.d';


// This function is currently used when creating or modifying a CollectionNode.
// So it doesn't add _score, documentCount nor interfaces, which isn't stored in the CollectionNode.
export function coerseCollectionType({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	collector,
	createdTime,
	creator,
	doCollect = false,
	documentTypeId,
	language,
	modifiedTime,
	modifier
} :CollectionNode) :Collection {
	return {
		_id,
		_name,
		_nodeType,
		_path,
		_versionKey,
		collector,
		createdTime,
		creator,
		doCollect,
		documentTypeId,
		language,
		modifiedTime,
		modifier
	};
}
