import type {
	BuildIndexConfigJavaBridge,
	BuildIndexConfigParameterObject
} from './types';

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
	indexTemplateToConfig
} from '@enonic/js-utils';

import {FIELD_PATH_META} from '../constants';
//import {logDummy} from './dummies';

interface IndexConfigEntry {
  decideByType: boolean;
  enabled: boolean;
  nGram: boolean;
  fulltext: boolean;
  includeInAllText: boolean;
  path: boolean;
  //indexValueProcessors?: ReadonlyArray<unknown>;
  languages?: Array<string>;
}


function decideByTypeFromValueType(valueType :string) :boolean {
	if ([VALUE_TYPE_STRING].includes(valueType)) {
		return false;
	}
	/*if ([
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
	].includes(valueType)) {
		return true;
	}*/
	return true;
}

export function buildIndexConfig({
	//data,
	fieldsObj,
	languages = []
} :BuildIndexConfigParameterObject, {
	//log = logDummy
} :BuildIndexConfigJavaBridge = {}) {
	const indexConfig = {
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
			config: indexTemplateToConfig({template: 'minimal'}) // This field is not stemmed
		},{
			path: `${FIELD_PATH_META}.collector.version`,
			config: indexTemplateToConfig({template: 'minimal'}) // This field is not stemmed
		},{
			path: `${FIELD_PATH_META}.createdTime`,
			config: indexTemplateToConfig({template: 'byType'}) // This field is not stemmed
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
			config: indexTemplateToConfig({template: 'byType'}) // This field is not stemmed
		}],
		default: indexTemplateToConfig({
			template: 'byType', // TODO Perhaps minimal?
			indexValueProcessors: [],
			languages: languages as [] // TODO
		})
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

		const config :Partial<IndexConfigEntry> = {
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
			config: config as IndexConfigEntry
		});
		//log.debug('indexConfig %s', indexConfig);
	}

	indexConfig.configs = indexConfig.configs.sort((a,b) => {
		const pathA = a.path;
		const pathB = b.path;
		if (pathA < pathB) {return -1;}
		if (pathA > pathB) {return 1;}
		return 0;// equal
	});

	//log.debug('indexConfig %s', indexConfig);
	return indexConfig;
}
