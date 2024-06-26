import type {
	Field,
	FieldNode
} from '@enonic-types/lib-explorer';


import {
	INDEX_CONFIG_TEMPLATE_BY_TYPE,
	VALUE_TYPE_STRING,
	indexTemplateToConfig,
	//isNotFalse,
	isNotSet,
	//isNotTrue,
	isString//,
	//toStr
} from '@enonic/js-utils';


const INSTRUCTION_CUSTOM = 'custom'; // Keeping this for backwards compatibility


export function coerceFieldType({
	// Required parameters
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	key,
	// Optional parameters. GraphQL passes null, so defaults are bypassed :(
	//description,
	indexConfig, // Can be null, string or object
	fieldType,
	max,
	min
} :FieldNode) :Field {
	/*log.debug(`_id:${_id}`);
	log.debug(`_name:${_name}`);
	log.debug(`_nodeType:${_nodeType}`);
	log.debug(`_path:${_path}`);
	log.debug(`_versionKey:${_versionKey}`);
	log.debug(`key:${key}`);
	log.debug(`description:${description}`);
	log.debug(`indexConfig:${toStr(indexConfig)}`);
	log.debug(`fieldType:${fieldType}`);
	log.debug(`max:${max}`);
	log.debug(`min:${min}`);*/

	// GraphQL passes null, so defaults are bypassed :(
	//if (isNotSet(description)) { description = ''; }
	if (isNotSet(indexConfig)) {
		indexConfig = indexTemplateToConfig({
			template:INDEX_CONFIG_TEMPLATE_BY_TYPE
		});
	}
	if (isNotSet(fieldType)) { fieldType = VALUE_TYPE_STRING; }
	if (isNotSet(max)) { max = 0; }
	if (isNotSet(min)) { min = 0; }
	/*log.debug(`key:${key} _id:${_id}`);
	log.debug(`key:${key} _name:${_name}`);
	log.debug(`key:${key} _nodeType:${_nodeType}`);
	log.debug(`key:${key} _path:${_path}`);
	log.debug(`key:${key} _versionKey:${_versionKey}`);
	log.debug(`key:${key} description:${description}`);
	log.debug(`key:${key} indexConfig:${toStr(indexConfig)}`);
	log.debug(`key:${key} fieldType:${fieldType}`);
	log.debug(`key:${key} max:${max}`);
	log.debug(`key:${key} min:${min}`);*/

	const instruction = isString(indexConfig) // Keeping this for backwards compatibility
		? (indexConfig === 'type' // type --> byType
			? INDEX_CONFIG_TEMPLATE_BY_TYPE
			: indexConfig)
		: INSTRUCTION_CUSTOM; // Keeping this for backwards compatibility
	//log.debug(`key:${key} instruction:${toStr(instruction)}`); // Keeping this for backwards compatibility

	const indexConfigObject = isString(indexConfig) ? indexTemplateToConfig({
		template: instruction as "none" | "byType" | "fulltext" | "path" | "minimal" // Keeping this for backwards compatibility
	}) : indexConfig;
	//log.debug(`key:${key} indexConfigObject:${toStr(indexConfigObject)}`);

	const {
		decideByType = true,
		enabled = true,
		fulltext = true,
		includeInAllText = true,
		nGram = true, // INDEX_CONFIG_N_GRAM
		path = false
	} = indexConfigObject;
	/*log.debug(`key:${key} decideByType:${toStr(decideByType)}`);
	log.debug(`key:${key} enabled:${toStr(enabled)}`);
	log.debug(`key:${key} fulltext:${toStr(fulltext)}`);
	log.debug(`key:${key} includeInAllText:${toStr(includeInAllText)}`);
	log.debug(`key:${key} nGram:${toStr(nGram)}`);
	log.debug(`key:${key} path:${toStr(path)}`);*/

	return {
		_id,
		_name,
		_nodeType,
		_path,
		_versionKey,
		decideByType,
		//description,
		enabled,
		fulltext,
		fieldType,
		indexConfig: indexConfigObject,
		includeInAllText,
		key,
		max,
		min,
		nGram, // INDEX_CONFIG_N_GRAM
		path,
		valueType: fieldType
	};
} // coerseFieldType
