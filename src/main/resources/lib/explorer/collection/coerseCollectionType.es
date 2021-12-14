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
	documentCount,
	documentTypeId,
	interfaces,// = [],
	language,
	modifiedTime,
	modifier
}) {
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
		documentCount,
		documentTypeId,
		interfaces,
		language,
		modifiedTime,
		modifier
	};
}
