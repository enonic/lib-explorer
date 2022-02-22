import type {
	Collection,
	CollectionNode
} from '/lib/explorer/collection/types.d';


export function coerseCollectionType({
	_id,
	_name,
	//_nodeType,
	//_path,
	_score, // TODO _score -> __score
	_versionKey,
	collector,
	createdTime,
	creator,
	doCollect = false,
	documentCount,
	documentTypeId,
	interfaces,// = [],
	language,
	modifiedTime,
	modifier//,
	//...rest // _childOrder
} :CollectionNode) :Collection {
	return {
		_id,
		_name,// : _name.toLowerCase(), // It should be written in lowercase
		//_nodeType,
		//_path,
		_score, // TODO _score -> __score
		_versionKey,
		collector,
		createdTime,
		creator,
		doCollect,
		documentCount,
		documentTypeId,
		interfaces,
		language,
		modifiedTime,
		modifier
	};
}
