import {
	INDEX_CONFIG_TEMPLATE_BY_TYPE,
	indexTemplateToConfig,
	isString//,
	//toStr
} from '@enonic/js-utils';


const INSTRUCTION_CUSTOM = 'custom'; // Keeping this for backwards compatibility


export function coerseFieldType({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	denyDelete,
	description,
	indexConfig = INDEX_CONFIG_TEMPLATE_BY_TYPE, // Can be string or object
	inResults,
	fieldType,
	key,
	max,
	min
}) {
	const instruction = isString(indexConfig) // Keeping this for backwards compatibility
		? (indexConfig === 'type' // type --> byType
			? INDEX_CONFIG_TEMPLATE_BY_TYPE
			: indexConfig)
		: INSTRUCTION_CUSTOM; // Keeping this for backwards compatibility
	//log.debug(`key:${key} instruction:${toStr(instruction)}`); // Keeping this for backwards compatibility

	const indexConfigObject = isString(indexConfig) ? indexTemplateToConfig({
		template: instruction // Keeping this for backwards compatibility
	}) : indexConfig;
	//log.debug(`key:${key} indexConfigObject:${toStr(indexConfigObject)}`);

	const {
		decideByType = true,
		enabled = true,
		fulltext = true,
		includeInAllText = true,
		nGram = true,
		path = false
	} = indexConfigObject;
	//log.debug(`key:${key} fulltext:${toStr(fulltext)}`);

	return {
		_id,
		_name,
		_nodeType,
		_path,
		_versionKey,
		denyDelete,
		description,
		fieldType,
		inResults,
		key,
		max,
		min,

		indexConfig: indexConfigObject,

		decideByType,
		enabled,
		fulltext,
		includeInAllText,
		nGram, // node._indexConfig.default.nGram uses uppercase G in nGram
		path
	};
} // coerseFieldType
