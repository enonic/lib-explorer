//import type {DocumentTypeNode} from '/lib/explorer-typescript/documentType/types.d';


// It seems scoped packages are not resolved in *.mjs files,
// so let's stay at *.es for files used on the server-side.
// https://webpack.js.org/guides/ecma-script-modules/
// Only the "default" export can be imported from non-ESM. Named exports are not available.
//import utils from '@enonic/js-utils';
//const forceArray = utils.forceArray;

import {
	INDEX_CONFIG_ENABLED_DEFAULT,
	INDEX_CONFIG_DECIDE_BY_TYPE_DEFAULT,
	INDEX_CONFIG_FULLTEXT_DEFAULT,
	INDEX_CONFIG_INCLUDE_IN_ALL_TEXT_DEFAULT,
	INDEX_CONFIG_N_GRAM,
	INDEX_CONFIG_N_GRAM_DEFAULT,
	INDEX_CONFIG_PATH_DEFAULT,
	VALUE_TYPE_STRING,
	forceArray,
	isNotSet,
	toStr
} from '@enonic/js-utils';


export function coerseDocumentTypeAddFields(addFields) {
	//log.debug(`resolveAddFields(${addFields})`);
	return isNotSet(addFields) ? true : addFields;
}


export function coerseDocumentTypeProperties(properties) {
	//log.debug(`resolveProperties(${toStr(properties)})`);
	const rv = (isNotSet(properties) ? [] : forceArray(properties)).map(({
		active,
		enabled,
		decideByType,
		fulltext,
		includeInAllText,
		max,
		min,
		name, // Required
		nGram,
		path,
		valueType
	}) => {
		if (isNotSet(name)) {
			throw new Error(`Corrupt data! Property without name in properties:${toStr(properties)}`);
		}
		return {
			active: isNotSet(active) ? true : active,
			enabled: isNotSet(enabled) ? INDEX_CONFIG_ENABLED_DEFAULT : enabled,
			decideByType: isNotSet(decideByType) ? INDEX_CONFIG_DECIDE_BY_TYPE_DEFAULT : decideByType,
			fulltext: isNotSet(fulltext) ? INDEX_CONFIG_FULLTEXT_DEFAULT : fulltext,
			includeInAllText: isNotSet(includeInAllText) ? INDEX_CONFIG_INCLUDE_IN_ALL_TEXT_DEFAULT : includeInAllText,
			max: isNotSet(max) ? 0 : max,
			min: isNotSet(min) ? 0 : min,
			name,
			[INDEX_CONFIG_N_GRAM]: isNotSet(nGram) ? INDEX_CONFIG_N_GRAM_DEFAULT : nGram,
			path: isNotSet(path) ? INDEX_CONFIG_PATH_DEFAULT : path,
			valueType: isNotSet(valueType) ? VALUE_TYPE_STRING : valueType
		};
	});
	//log.debug(`resolveProperties(${toStr(properties)}) --> ${toStr(rv)}`);
	return rv;
}


export function coerseDocumentType({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	addFields,
	properties
}) {
	/*log.debug(`coerseDocumentType({
		_id:${_id},
		_name:${_name},
		_nodeType:${_nodeType},
		_path:${_path},
		_versionKey:${_versionKey},
		addFields:${addFields},
		properties:${toStr(properties)}
	})`);*/
	const rv = {
		_id,
		_name,
		_nodeType,
		_path,
		_versionKey,
		addFields: coerseDocumentTypeAddFields(addFields),
		properties: coerseDocumentTypeProperties(properties)
	};
	/*log.debug(`coerseDocumentType({
		_id:${_id},
		_name:${_name},
		_nodeType:${_nodeType},
		_path:${_path},
		_versionKey:${_versionKey},
		addFields:${addFields},
		properties:${toStr(properties)}
	}) --> ${toStr(rv)}`);*/
	return rv;
}
