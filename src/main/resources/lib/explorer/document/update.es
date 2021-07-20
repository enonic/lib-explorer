import {
	indexTemplateToConfig,
	isNotSet,
	isObject,
	toStr
} from '@enonic/js-utils';
//import getIn from 'get-value';
//import setIn from 'set-value';
//import traverse from 'traverse';
import {detailedDiff} from 'deep-object-diff';
import deepEqual from 'fast-deep-equal';
//import HumanDiff from 'human-object-diff';
//const Diff = require('diff');

import {getFieldsWithIndexConfigAndValueType} from '/lib/explorer/document/create';
import {checkOccurrencesAndBuildIndexConfig} from '/lib/explorer/document/checkOccurrencesAndBuildIndexConfig';
import {checkAndApplyTypes/*, tryApplyValueType*/} from '/lib/explorer/document/checkAndApplyTypes';
import {
	FIELD_MODIFIED_TIME_INDEX_CONFIG,
	NT_DOCUMENT
} from '/lib/explorer/model/2/constants';

import {instant} from '/lib/xp/value.js';
/*const { diff: diffDocument } = new HumanDiff({
	objectName: 'document'
});*/


export function update({
	_id,
	...rest
}, {
	boolPartial,
	boolRequireValid,
	connection,
	language,
	...ignoredOptions
} = {}) {
	Object.keys(rest).forEach((k) => {
		if (k.startsWith('__')) {
			log.warning(`Deprecation: Function signature changed. Added second argument for options.
		Old: document.update({${k}, ...})
		New: document.update({...}, {${k.substring(2)}})`);
			if(k === '__boolPartial') {
				if (isNotSet(boolPartial)) {
					boolPartial = rest[k];
				}
			} else if(k === '__boolRequireValid') {
				if (isNotSet(boolRequireValid)) {
					boolRequireValid = rest[k];
				}
			} else if(k === '__connection') {
				if (isNotSet(connection)) {
					connection = rest[k];
				}
			} else {
				log.warning(`document.update: Ignored option:${k} value:${toStr(rest[k])}`);
			}
			delete rest[k];
		} // startsWith __
	});

	if (isNotSet(boolPartial)) {
		boolPartial = false;
	}

	if (isNotSet(boolRequireValid)) {
		boolRequireValid = true;
	}

	if (Object.keys(ignoredOptions).length) {
		log.warning(`document.update: Ignored options:${toStr(ignoredOptions)}`);
	}
	//log.debug(`_id:${toStr(_id)}`);

	//log.debug(`fieldsToUpdate:${toStr(fieldsToUpdate)}`);

	if(!_id) {
		throw new Error('Missing required parameter _id!');
	}
	const existingNode = connection.get(_id);
	if (!existingNode) {
		throw new Error(`Can't update document with id:${_id} because it does not exist!`);
	}
	//log.info(`existingNode:${toStr(existingNode)}`);

	// Sort by path for diff
	existingNode._indexConfig.configs = existingNode._indexConfig.configs.sort((a,b) => {
		const pathA = a.path;
		const pathB = b.path;
		if (pathA < pathB) {return -1;}
		if (pathA > pathB) {return 1;}
		return 0;// equal
	});
	//log.debug(`existingNode._indexConfig.configs:${toStr(existingNode._indexConfig.configs)}`);

	const fields = getFieldsWithIndexConfigAndValueType();
	//log.info(`fields:${toStr(fields)}`);

	const strigified = JSON.stringify(existingNode);
	const forDiff = JSON.parse(strigified);
	const withType = JSON.parse(strigified);

	// Delete old data if not partial update:
	if (!boolPartial) {
		Object.keys(forDiff).forEach((k) => {
			//log.debug(`k:${k}`);
			if (!k.startsWith('_') && !['document_metadata'].includes(k)) {
				//log.debug(`deleting key:${k} with value:${toStr(forDiff[k])}`);
				delete forDiff[k];
				delete withType[k];
			}
		});
	}
	//log.debug(`forDiff:${toStr(forDiff)}`);
	//log.debug(`withType:${toStr(withType)}`);
	const languages = [];
	if (language) {
		languages.push(language);
	}
	const indexConfig = {
		default: indexTemplateToConfig({
			template: 'byType', // TODO Perhaps minimal?
			indexValueProcessors: [],
			languages
		}),
		configs: [/*{
			path: 'document_metadata',
			config: templateToConfig({
				template: 'minimal',
				indexValueProcessors: [],
				languages: []
			})
		}*/]
	};

	const inputObject = JSON.parse(JSON.stringify(rest));
	//delete inputObject._indexConfig;
	if (isNotSet(inputObject.document_metadata)) {
		inputObject.document_metadata = {};
	} else if (!isObject(inputObject.document_metadata)) {
		log.error(`document_metadata has to be an Object! Overwriting:${toStr(inputObject.document_metadata)}`);
		inputObject.document_metadata = {};
	}
	inputObject.document_metadata.valid = true; // Temporary value so validation doesn't fail on this field.
	inputObject.document_metadata.createdTime = forDiff.document_metadata.createdTime; // So validation doesn't fail on this field.
	//inputObject.document_metadata.modifiedTime = new Date(); // Temporary value to checkOccurrencesAndBuildIndexConfig

	const now = new Date();

	// Enforce type
	inputObject._nodeType = NT_DOCUMENT; // Temporary value so validation doesn't fail on this field.
	forDiff._nodeType = NT_DOCUMENT;
	withType._nodeType = NT_DOCUMENT;

	// 1st "pass":
	// Skip checking occurrences, since that is checked in 2nd "pass".
	// Check types, since that is skipped in 2nd "pass".
	let boolValid = checkAndApplyTypes({
		boolRequireValid,
		boolValid: true, // passed as value, not possible to modify, return instead?
		fields,
		mode: 'diff',
		inputObject, // only traversed within function
		objToPersist: forDiff // modified within function
	});

	checkAndApplyTypes({
		boolRequireValid,
		boolValid: true, // passed as value, not possible to modify, return instead?
		fields,
		mode: 'update',
		inputObject, // only traversed within function
		objToPersist: withType // modified within function
	});

	// 2nd "pass":
	// * Check if all required fields have values.
	// * Check if any field have too many values.
	// * Skipping type checking, since that is checked in 1st "pass".
	// * Build indexConfig for any field with a value.
	try {
		checkOccurrencesAndBuildIndexConfig({
			boolRequireValid,
			fields,
			indexConfig, // modified within function
			inputObject, // only read from within function
			language
		});
	} catch (e) {
		if (boolRequireValid) {
			throw e;
		} else {
			boolValid = false;
			//log.warning(e.message); // Already logged within function
		}
	}
	//log.info(`indexConfig:${toStr(indexConfig)}`);

	forDiff.document_metadata.valid = boolValid;
	withType.document_metadata.valid = boolValid;

	if (deepEqual(existingNode, forDiff)) {
		log.debug(`No changes detected, not updating document with id:${_id}`);
		return existingNode;
	}
	//log.info(`Changes detected in document with id:${_id}`);

	forDiff.document_metadata.modifiedTime = now;
	withType.document_metadata.modifiedTime = instant(now);

	const indexConfigForModifiedTime = {
		path: 'document_metadata.modifiedTime',
		config: indexTemplateToConfig({
			template: FIELD_MODIFIED_TIME_INDEX_CONFIG,
			indexValueProcessors: [],
			languages: []
		})
	};

	if (!forDiff._indexConfig.configs.filter(({path}) => path === 'document_metadata.modifiedTime').length) {
		forDiff._indexConfig.configs.push(indexConfigForModifiedTime);
	}

	if (!withType._indexConfig.configs.filter(({path}) => path === 'document_metadata.modifiedTime').length) {
		withType._indexConfig.configs.push(indexConfigForModifiedTime);
	}

	//log.info(`Changes detected in document with id:${_id} diff:${toStr(Diff.diffJson(existingNode, forDiff))}`);
	log.debug(`Changes detected in document with id:${_id} diff:${toStr(detailedDiff(existingNode, forDiff))}`);
	//log.info(`Changes detected in document with id:${_id} diff:${toStr(diffDocument(existingNode, forDiff))}`);

	const updatedNode = connection.modify({
		key: _id,
		editor: () => {
			return withType;
		}
	});
	//log.info(`updatedNode:${toStr(updatedNode)}`);
	return updatedNode;
}
