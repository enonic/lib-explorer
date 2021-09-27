import {
	INDEX_CONFIG_TEMPLATE_BY_TYPE,
	indexTemplateToConfig,
	isString//,
	//toStr
} from '@enonic/js-utils';


const INSTRUCTION_CUSTOM = 'custom';


export function coerseFieldType({
	_id,
	_name,
	_nodeType,
	_path,
	denyDelete,
	description,
	indexConfig = INDEX_CONFIG_TEMPLATE_BY_TYPE,
	inResults,
	fieldType,
	key,
	max,
	min
}) {
	const instruction = isString(indexConfig)
		? (indexConfig === 'type'
			? INDEX_CONFIG_TEMPLATE_BY_TYPE
			: indexConfig)
		: INSTRUCTION_CUSTOM;
	//log.debug(`key:${key} instruction:${toStr(instruction)}`);

	const indexConfigObject = isString(indexConfig) ? indexTemplateToConfig({
		template: instruction
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
		denyDelete,
		description,
		fieldType,
		inResults,
		key,
		max,
		min,

		indexConfig: indexConfigObject,
		instruction,

		decideByType,
		enabled,
		fulltext,
		includeInAllText,
		nGram, // node._indexConfig.default.nGram uses uppercase G in nGram
		path
	};
} // coerseFieldType
