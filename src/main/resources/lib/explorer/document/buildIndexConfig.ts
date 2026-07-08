import type {
	NodeConfigEntry,
	NodeIndexConfig,
} from '@enonic-types/lib-node';
import type { DocumentTypeFieldsObject } from '@enonic-types/lib-explorer';

import {
	// VALUE_TYPE_ANY,
	// VALUE_TYPE_BOOLEAN,
	// VALUE_TYPE_DOUBLE,
	// VALUE_TYPE_GEO_POINT,
	// VALUE_TYPE_INSTANT,
	// VALUE_TYPE_LOCAL_DATE,
	// VALUE_TYPE_LOCAL_DATE_TIME,
	// VALUE_TYPE_LOCAL_TIME,
	// VALUE_TYPE_LONG,
	// VALUE_TYPE_REFERENCE,
	// VALUE_TYPE_SET,
	VALUE_TYPE_STRING,
	indexTemplateToConfig,
	sortByProperty,
} from '@enonic/js-utils';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import { toStr } from '@enonic/js-utils/value/toStr';
import { FIELD_PATH_META } from '/lib/explorer/constants';


export interface NodeIndexConfigWithAlltext extends NodeIndexConfig {
	allText: {
		enabled: boolean;
		nGram: boolean;
		fulltext: boolean;
		languages: string[];
	}
}

export interface BuildIndexConfigParameterObject {
	_debug?: boolean;
	_trace?: boolean;
	// data: AnyObject
	fieldsObj: DocumentTypeFieldsObject
	languages: string[]
}


const DEBUG = false;
const TRACE = false;
const LOG_PREFIX = 'buildIndexConfig:';

function decideByTypeFromValueType(valueType: string): boolean {
	if (arrayIncludes([VALUE_TYPE_STRING], valueType)) {
		return false;
	}
	// if (arrayIncludes([
	// 	VALUE_TYPE_ANY,
	// 	VALUE_TYPE_BOOLEAN,
	// 	VALUE_TYPE_DOUBLE,
	// 	VALUE_TYPE_GEO_POINT,
	// 	VALUE_TYPE_INSTANT,
	// 	VALUE_TYPE_LOCAL_DATE,
	// 	VALUE_TYPE_LOCAL_DATE_TIME,
	// 	VALUE_TYPE_LOCAL_TIME,
	// 	VALUE_TYPE_LONG,
	// 	VALUE_TYPE_REFERENCE,
	// 	VALUE_TYPE_SET
	// ], valueType)) {
	// 	return true;
	// }
	return true;
}

export function buildIndexConfig(
	{
		_debug = DEBUG,
		_trace = TRACE,
		// data,
		fieldsObj,
		languages = []
	}: BuildIndexConfigParameterObject,
): NodeIndexConfigWithAlltext {
	const indexConfig: NodeIndexConfigWithAlltext = {
		configs: [{
			path: `${FIELD_PATH_META}.collection`,
			config: {
				decideByType: false,
				enabled: true,
				fulltext: true,
				includeInAllText: false,
				indexValueProcessors: [],
				languages: [], // This field is not stemmed
				nGram: true,
				path: false
			}
		},{
			path: `${FIELD_PATH_META}.collector.id`,
			config: indexTemplateToConfig({template: 'minimal'}), // This field is not stemmed
		},{
			path: `${FIELD_PATH_META}.collector.version`,
			config: indexTemplateToConfig({template: 'minimal'}), // This field is not stemmed
		},{
			path: `${FIELD_PATH_META}.createdTime`,
			config: indexTemplateToConfig({template: 'byType'}), // This field is not stemmed
		},{
			path: `${FIELD_PATH_META}.documentType`,
			config: {
				decideByType: false,
				enabled: true,
				fulltext: true,
				includeInAllText: false,
				indexValueProcessors: [],
				languages: [], // This field is not stemmed
				nGram: true,
				path: false
			}
		},{
			path: `${FIELD_PATH_META}.language`,
			config: {
				decideByType: false,
				enabled: true,
				fulltext: true,
				includeInAllText: false,
				indexValueProcessors: [],
				languages: [], // This field is not stemmed
				nGram: true,
				path: false
			}
		},{
			path: `${FIELD_PATH_META}.stemmingLanguage`,
			config: {
				decideByType: false,
				enabled: true,
				fulltext: true,
				includeInAllText: false,
				indexValueProcessors: [],
				languages: [], // This field is not stemmed
				nGram: true,
				path: false
			}
		},{
			path: `${FIELD_PATH_META}.valid`,
			config: indexTemplateToConfig({template: 'byType'}), // This field is not stemmed
		}],
		default: indexTemplateToConfig({
			template: 'byType', // TODO Perhaps minimal?
			indexValueProcessors: [],

			// Default is no stemming.
			// languages: languages as []

		}),
		allText: {
			enabled: true,
			nGram: true,
			fulltext: true,
			languages
    	}
	};

	const fieldKeys = Object.keys(fieldsObj);
	for (let i = 0; i < fieldKeys.length; i++) {
		const fieldPath = fieldKeys[i];
		if (_trace) log.debug('%s fieldPath %s', LOG_PREFIX, fieldPath);

		const {
			// decideByType,
			enabled,
			fulltext,
			includeInAllText,
			nGram,
			path,
			stemmed,
			valueType
		} = fieldsObj[fieldPath];
		if (_trace) log.debug('%s fieldPath:%s stemmed:%s', LOG_PREFIX, fieldPath, stemmed);

		const config: NodeConfigEntry = {
			decideByType: decideByTypeFromValueType(valueType),
			enabled,
			fulltext: valueType === VALUE_TYPE_STRING ? fulltext : false,
			includeInAllText,
			indexValueProcessors: [],
			languages: [],
			nGram: valueType === VALUE_TYPE_STRING ? nGram : false,
			path: valueType === VALUE_TYPE_STRING ? path : false
		};
		if (_trace) log.debug('%s config %s', LOG_PREFIX, toStr(config));

		if (valueType === VALUE_TYPE_STRING && stemmed) {
			config.languages = languages;
		}
		if (_trace) log.debug('%s config with languages %s', LOG_PREFIX, toStr(config));

		indexConfig.configs.push({
			path: fieldPath,
			config: config,
		});
		if (_trace) log.debug('%s partial indexConfig:%s', LOG_PREFIX, toStr(indexConfig));
	} // for fieldKeys

	indexConfig.configs = sortByProperty(indexConfig.configs, 'path');

	if (_debug) log.debug('%s final indexConfig %s', LOG_PREFIX, toStr(indexConfig));
	return indexConfig;
}
