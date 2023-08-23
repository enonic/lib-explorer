//import type {JavaBridge} from '../../_coupling/types.d';
import type {
	IndexConfig,
	IndexConfigConfig,
	IndexConfigObject
} from '../../types/IndexConfig';
import type {BuildIndexConfigParameterObject} from './types';


import {
	/*VALUE_TYPE_ANY,
	VALUE_TYPE_BOOLEAN,
	VALUE_TYPE_DOUBLE,
	VALUE_TYPE_GEO_POINT,
	VALUE_TYPE_INSTANT,
	VALUE_TYPE_LOCAL_DATE,
	VALUE_TYPE_LOCAL_DATE_TIME,
	VALUE_TYPE_LOCAL_TIME,
	VALUE_TYPE_LONG,
	VALUE_TYPE_REFERENCE,
	VALUE_TYPE_SET,*/
	VALUE_TYPE_STRING,
	indexTemplateToConfig,
	sortByProperty
} from '@enonic/js-utils';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import {FIELD_PATH_META} from '../../constants';
//import {javaBridgeDummy} from '../dummies';


function decideByTypeFromValueType(valueType :string) :boolean {
	if (arrayIncludes([VALUE_TYPE_STRING], valueType)) {
		return false;
	}
	/*if (arrayIncludes([
		VALUE_TYPE_ANY,
		VALUE_TYPE_BOOLEAN,
		VALUE_TYPE_DOUBLE,
		VALUE_TYPE_GEO_POINT,
		VALUE_TYPE_INSTANT,
		VALUE_TYPE_LOCAL_DATE,
		VALUE_TYPE_LOCAL_DATE_TIME,
		VALUE_TYPE_LOCAL_TIME,
		VALUE_TYPE_LONG,
		VALUE_TYPE_REFERENCE,
		VALUE_TYPE_SET
	], valueType)) {
		return true;
	}*/
	return true;
}

export function buildIndexConfig(
	{
		//data,
		fieldsObj,
		languages = []
	} :BuildIndexConfigParameterObject//,
	//javaBridge :JavaBridge = javaBridgeDummy
) :IndexConfig {
	//const {log} = javaBridge;
	const indexConfig :IndexConfig = {
		configs: [{
			path: `${FIELD_PATH_META}.collection`,
			config: {
				decideByType: false,
				enabled: true,
				fulltext: true,
				includeInAllText: false,
				//languages // This field is not stemmed
				nGram: true,
				path: false
			}
		},{
			path: `${FIELD_PATH_META}.collector.id`,
			config: indexTemplateToConfig({template: 'minimal'}) as IndexConfigObject // This field is not stemmed
		},{
			path: `${FIELD_PATH_META}.collector.version`,
			config: indexTemplateToConfig({template: 'minimal'}) as IndexConfigObject // This field is not stemmed
		},{
			path: `${FIELD_PATH_META}.createdTime`,
			config: indexTemplateToConfig({template: 'byType'}) as IndexConfigObject // This field is not stemmed
		},{
			path: `${FIELD_PATH_META}.documentType`,
			config: {
				decideByType: false,
				enabled: true,
				fulltext: true,
				includeInAllText: false,
				//languages // This field is not stemmed
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
				//languages // This field is not stemmed
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
				//languages // This field is not stemmed
				nGram: true,
				path: false
			}
		},{
			path: `${FIELD_PATH_META}.valid`,
			config: indexTemplateToConfig({template: 'byType'}) as IndexConfigObject // This field is not stemmed
		}],
		default: indexTemplateToConfig({
			template: 'byType', // TODO Perhaps minimal?
			indexValueProcessors: [],
			languages: languages as [] // TODO
		}) as IndexConfigObject
	};

	const fieldKeys = Object.keys(fieldsObj);
	for (let i = 0; i < fieldKeys.length; i++) {
		const fieldPath = fieldKeys[i];
		//log.debug('fieldPath %s', fieldPath);

		const {
			//decideByType,
			enabled,
			fulltext,
			includeInAllText,
			nGram,
			path,
			valueType
		} = fieldsObj[fieldPath];

		const config: IndexConfigConfig = {
			decideByType: decideByTypeFromValueType(valueType),
			enabled,
			fulltext,
			includeInAllText,
			nGram,
			path
		};
		//log.debug('config %s', config);

		if (valueType === VALUE_TYPE_STRING) {
			config.languages = languages;
		}
		//log.debug('config %s', config);

		indexConfig.configs.push({
			path: fieldPath,
			config: config as IndexConfigConfig
		});
		//log.debug('indexConfig %s', indexConfig);
	}

	indexConfig.configs = sortByProperty(indexConfig.configs, 'path');

	//log.debug('indexConfig %s', indexConfig);
	return indexConfig;
}
