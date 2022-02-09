import type {CollectionNode} from '/lib/explorer-typescript/collection/types.d';


export function coerseCollectionType({
	_id,
	_name,
	_nodeType,
	_path,
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
	modifier
} :CollectionNode) :Omit<
	CollectionNode,
	'_childOrder'
		|'_indexConfig'
		|'_inheritsPermissions'
		|'_permissions'
		|'_state'
		|'_ts'
> {
	return {
		_id,
		_name,// : _name.toLowerCase(), // It should be written in lowercase
		_nodeType,
		_path,
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
