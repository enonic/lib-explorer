import {
	indexTemplateToConfig,
	isNotSet,
	isObject,
	toStr
} from '@enonic/js-utils';
import {detailedDiff} from 'deep-object-diff';
import deepEqual from 'fast-deep-equal';

//import HumanDiff from 'human-object-diff';
//const Diff = require('diff');
import {getFieldsWithIndexConfigAndValueType} from '/lib/explorer/document/create';
import {checkOccurrencesAndBuildIndexConfig} from '/lib/explorer/document/checkOccurrencesAndBuildIndexConfig';
import {checkAndApplyTypes/*, tryApplyValueType*/} from '/lib/explorer/document/checkAndApplyTypes';
import {maybeAddFields} from '/lib/explorer/document/maybeAddFields';
import {getDocumentTypeFromCollectionName} from '/lib/explorer/documentType/getDocumentTypeFromCollectionName';
import {
	FIELD_PATH_META,
	FIELD_MODIFIED_TIME_INDEX_CONFIG,
	NT_DOCUMENT
} from '/lib/explorer/model/2/constants';
import {javaLocaleToSupportedLanguage} from '/lib/explorer/stemming/javaLocaleToSupportedLanguage';

import {instant} from '/lib/xp/value.js';
/*const { diff: diffDocument } = new HumanDiff({
	objectName: 'document'
});*/


//──────────────────────────────────────────────────────────────────────────
// Goals:
//  * Build fresh _indexConfig from everything (except NEW FIELD_PATH_META.modifiedTime) that gets stored based on the current field configuration.
//  * Validate everything (except NEW FIELD_PATH_META.modifiedTime) that gets stored (checking types, occurrences) against the current field configuration.
//  * Diff everything (except FIELD_PATH_META.modifiedTime)
//
// Thoughts:
//  * The existing document need to be fetched for diffing, and for partial updates.
//  * Even the _indexConfig could be validated.
//
// Implementation steps:
//  1. Fetch exisiting document (for multiple possible uses) and remove POTENTIAL OLD FIELD_PATH_META.modifiedTime.
//  2. Determine all data to build _indexConfig from
//   2a. Full update (do not use exisiting document).
//   2b. Partial update (apply new data upon existing document).
//  3. Build fresh _indexConfig. NOTE: We are checking occurrences at the same time (but not occurrences within _indexConfig)
//  4. Validate the document to be stored (only type checking, because occurrences already checked).
//  5. Diff the document to be stored against exisiting document (even FIELD_PATH_META.valid).
//   5a. No changes: "quit"
//   5b. Changes: apply types, apply NEW modifiedTime and _indexConfig for modifiedTime. Finally modify the document node.
//──────────────────────────────────────────────────────────────────────────
export function update({
	_id,
	...passedInDataExceptId
}, {
	boolPartial,
	boolRequireValid,
	collectionName,
	connection,
	documentTypeObj,
	language: languageParam,
	...ignoredOptions
} = {}) {
	Object.keys(passedInDataExceptId).forEach((k) => {
		if (k.startsWith('__')) {
			log.warning(`Deprecation: Function signature changed. Added second argument for options.
		Old: document.update({${k}, ...})
		New: document.update({...}, {${k.substring(2)}})`);
			if(k === '__boolPartial') {
				if (isNotSet(boolPartial)) {
					boolPartial = passedInDataExceptId[k];
				}
			} else if(k === '__boolRequireValid') {
				if (isNotSet(boolRequireValid)) {
					boolRequireValid = passedInDataExceptId[k];
				}
			} else if(k === '__connection') {
				if (isNotSet(connection)) {
					connection = passedInDataExceptId[k];
				}
			} else {
				log.warning(`document.update: Ignored option:${k} value:${toStr(passedInDataExceptId[k])}`);
			}
			delete passedInDataExceptId[k];
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

	if(!_id) {
		throw new Error('Missing required parameter _id!');
	}
	//log.debug(`_id:${toStr(_id)}`);

	if (!passedInDataExceptId[FIELD_PATH_META]) {
		passedInDataExceptId[FIELD_PATH_META] = {};
	}

	//──────────────────────────────────────────────────────────────────────────
	// 1. Fetch exisiting document
	//──────────────────────────────────────────────────────────────────────────
	const existingNode = connection.get(_id);
	if (!existingNode) {
		throw new Error(`Can't update document with id:${_id} because it does not exist!`);
	}
	//log.info(`existingNode:${toStr(existingNode)}`);

	if (existingNode[FIELD_PATH_META]) { // Ticket#4971 Old documents doesn't have the new field FIELD_PATH_META
		// Not needed for partial update and unwanted when diffing
		delete existingNode[FIELD_PATH_META].modifiedTime;
	}

	if (isObject(existingNode._indexConfig) && existingNode._indexConfig.configs) {
		if (!Array.isArray(existingNode._indexConfig.configs)) {
			existingNode._indexConfig.configs = [existingNode._indexConfig.configs];
		}
		let indexOfConfigForModifiedTime = -1;
		existingNode._indexConfig.configs.forEach(({path}, i) => {
			if (path === `${FIELD_PATH_META}.modifiedTime`) {
				indexOfConfigForModifiedTime = i;
			}
		});
		if (indexOfConfigForModifiedTime !== -1) {
			// Unwanted when diffing
			existingNode._indexConfig.configs.splice(indexOfConfigForModifiedTime, 1);
		}
	}

	//──────────────────────────────────────────────────────────────────────────
	// 2. Determine all data to store
	//──────────────────────────────────────────────────────────────────────────
	const dataToBuildIndexConfigFrom = JSON.parse(JSON.stringify(existingNode));

	// Always delete old _indexConfig (both when full or partial update) (it might be based on old fields configuration)
	delete dataToBuildIndexConfigFrom._indexConfig;

	// Handling corruptions in old data
	if (!dataToBuildIndexConfigFrom[FIELD_PATH_META]) {
		dataToBuildIndexConfigFrom[FIELD_PATH_META] = {};
	} else if (!isObject(dataToBuildIndexConfigFrom[FIELD_PATH_META])) {
		log.error(`_id:${_id} ${FIELD_PATH_META} has to be an Object! Overwriting:${toStr(dataToBuildIndexConfigFrom[FIELD_PATH_META])}`);
		dataToBuildIndexConfigFrom[FIELD_PATH_META] = {};
	}

	const now = new Date();

	if (isNotSet(dataToBuildIndexConfigFrom[FIELD_PATH_META].createdTime)) {
		log.error(`_id:${_id} ${FIELD_PATH_META}.createdTime missing, setting to now`);
		dataToBuildIndexConfigFrom[FIELD_PATH_META].createdTime = now;
	}

	if (isNotSet(dataToBuildIndexConfigFrom[FIELD_PATH_META].valid)) {
		log.error(`_id:${_id} ${FIELD_PATH_META}.valid missing, setting to false before validation`);
		dataToBuildIndexConfigFrom[FIELD_PATH_META].valid = false;
	}

	// Always delete old FIELD_PATH_META.modifiedTime (if present)
	delete dataToBuildIndexConfigFrom[FIELD_PATH_META].modifiedTime; // We don't want this before after diffing

	// If full update:
	// * delete old data
	// * keep system fields (_id, _name, _path, _childOrder, _inheritsPermissions, _permissions, _state, _nodeType, _versionKey, _ts) (except _indexConfig)
	// * keep FIELD_PATH_META? (only createdTime) (not collector, modifiedTime, language, stemmingLanguage and valid)
	if (!boolPartial) {
		delete dataToBuildIndexConfigFrom._indexConfig;
		dataToBuildIndexConfigFrom[FIELD_PATH_META] = dataToBuildIndexConfigFrom[FIELD_PATH_META].createdTime
			? {
				createdTime: dataToBuildIndexConfigFrom[FIELD_PATH_META].createdTime
			}
			: {};
		Object.keys(dataToBuildIndexConfigFrom).forEach((k) => {
			//log.debug(`k:${k}`);
			if (!k.startsWith('_') && k !== FIELD_PATH_META) {
				//log.debug(`deleting key:${k} with value:${toStr(dataToBuildIndexConfigFrom[k])}`);
				delete dataToBuildIndexConfigFrom[k];
				//delete withType[k];
			}
		});
	}
	//log.debug(`dataToBuildIndexConfigFrom:${toStr(dataToBuildIndexConfigFrom)}`);

	// At this point dataToBuildIndexConfigFrom SHOULD contain "old" system fields, old FIELD_PATH_META and perhaps some old data (when partial update)
	// If the existing document is corrupt, an update should still work.
	// Full update is easy, simply overwrite all root properties (fields)
	// What should happen on partial update? Should values be added to previous if array??? Nah, any field mentioned should be overwritten. Or complexity escalates.

	// NOTE: passedInDataExceptId may contain data we don't want the client to control:
	// _name, _path, _childOrder, _inheritsPermissions, _nodeType, _permissions, _state, _versionKey, _ts
	// FIELD_PATH_META
	// TODO Perhaps allow _indexConfig?

	/*──────────────────────────────────────────────────────────────────────────
	 Test if _indexconfig is added? SUCCESS :)
	 Test unwanted properties in FIELD_PATH_META? SUCCESS :) They are not added.
	{
      _id: "...",
      FIELD_PATH_META: {
	    collector: { // Yeah, it should be possible to change the collector on a collection with existing data...
  		  id: 'collectorId',
		  version: '1.2.3'
	    },
        createdTime: "2021-01-01T01:01:01.001Z", // should keep current value
        modifiedTime: "2021-01-01T01:01:01.001Z", // should get new value of now
        language: "en-US",
        stemmingLanguage: "should be overwritten",
        valid: true, // should be result of validation, not what is passed in
        unwanted: "should not exist"
      }
	}
	──────────────────────────────────────────────────────────────────────────*/

	// NOTE Oh, man. We have tree places language can come from:
	//   1. The existing node (dataToBuildIndexConfigFrom[FIELD_PATH_META].language)
	//   2. The collection language (languageParam)
	//   3. Node specific language (FIELD_PATH_META.language)
	// 1 should only be kept if partial update and 2 and 3 is not passed in.
	// 3 wins(if passed in), fallback to 2(if passed in), fallback to 1.

	const language = passedInDataExceptId[FIELD_PATH_META].language
		|| languageParam
		|| dataToBuildIndexConfigFrom[FIELD_PATH_META].language; // Full update may have delete this

	// NOTE What if no FIELD_PATH_META is passed in?
	// We still have to set language?
	Object.keys(passedInDataExceptId).forEach((k) => {
		if (k === FIELD_PATH_META) {
			// This will always remove collector unless passed in, but that's ok because collector is always passed in by Collector.persistDocument
			// And it makes it possible to switch between using collector or document REST api for a collection.
			dataToBuildIndexConfigFrom[FIELD_PATH_META].collector = passedInDataExceptId[FIELD_PATH_META].collector;
		} else { // !FIELD_PATH_META
			if (!k.startsWith('_')) {
				// Do not add empty arrays
				if (!(Array.isArray(passedInDataExceptId[k]) && !passedInDataExceptId[k].length)) {
					dataToBuildIndexConfigFrom[k] = passedInDataExceptId[k];
				}
			}
		}
	});
	if (language) {
		dataToBuildIndexConfigFrom[FIELD_PATH_META].language = language;
		// TODO We might want to cache language->stemmingLanguage somewhere
		dataToBuildIndexConfigFrom[FIELD_PATH_META].stemmingLanguage = javaLocaleToSupportedLanguage(language);
	}

	// Handle potentially corrupt data
	dataToBuildIndexConfigFrom._inheritsPermissions = true;
	dataToBuildIndexConfigFrom._nodeType = NT_DOCUMENT; // Enforce type
	delete dataToBuildIndexConfigFrom._parentPath; // Not a property when modifying a node

	//──────────────────────────────────────────────────────────────────────────
	// 3. Build fresh _indexConfig & 4. Validate the document to be stored
	//──────────────────────────────────────────────────────────────────────────
	const fields = getFieldsWithIndexConfigAndValueType();
	//log.info(`fields:${toStr(fields)}`);

	// 1st "pass":
	// Skip checking occurrences, since that is checked in 2nd "pass".
	// Check types, since that is skipped in 2nd "pass".
	let boolValid = checkAndApplyTypes({
		boolRequireValid,
		boolValid: true, // passed as value, not possible to modify, return instead
		fields,
		mode: 'diff', // NOTE: Only type-cheching, not applying types
		inputObject: JSON.parse(JSON.stringify(dataToBuildIndexConfigFrom)), // only traversed within function
		objToPersist: dataToBuildIndexConfigFrom // modified within function
	});
	dataToBuildIndexConfigFrom[FIELD_PATH_META].valid = boolValid; // Validity before checking occurrences.

	const languages = [];
	if (dataToBuildIndexConfigFrom[FIELD_PATH_META].stemmingLanguage) {
		languages.push(dataToBuildIndexConfigFrom[FIELD_PATH_META].stemmingLanguage);
	}
	//log.debug(`update languages:${toStr(languages)}`);

	// 2nd "pass":
	// * Check if all required fields have values.
	// * Check if any field have too many values.
	// * Skipping type checking, since that is checked in 1st "pass".
	// * Build indexConfig for any field with a value.
	const indexConfig = {
		default: indexTemplateToConfig({
			template: 'byType', // TODO Perhaps minimal?
			indexValueProcessors: [],
			languages
		}),
		configs: [/*{
			path: 'FIELD_PATH_META',
			config: templateToConfig({
				template: 'minimal',
				indexValueProcessors: [],
				languages: []
			})
		}*/]
	};

	try {
		checkOccurrencesAndBuildIndexConfig({
			boolRequireValid,
			fields,
			indexConfig, // modified within function
			inputObject: dataToBuildIndexConfigFrom, // only read from within function
			language: dataToBuildIndexConfigFrom[FIELD_PATH_META].stemmingLanguage // may be undefined, especially for full updates
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

	//──────────────────────────────────────────────────────────────────────────
	// 5. Diffing
	//──────────────────────────────────────────────────────────────────────────

	// Sort by path for diff
	existingNode._indexConfig.configs = existingNode._indexConfig.configs.sort((a,b) => {
		const pathA = a.path;
		const pathB = b.path;
		if (pathA < pathB) {return -1;}
		if (pathA > pathB) {return 1;}
		return 0;// equal
	});
	//log.debug(`existingNode._indexConfig.configs:${toStr(existingNode._indexConfig.configs)}`);

	const documentToDiff = dataToBuildIndexConfigFrom; // No need to deref since we're not using dataToBuildIndexConfigFrom after this point...
	documentToDiff[FIELD_PATH_META].valid = boolValid; // Final validity

	documentToDiff._indexConfig = indexConfig;

	if (deepEqual(existingNode, documentToDiff)) {
		log.debug(`No changes detected, not updating document with id:${_id}`);
		return existingNode;
	}

	// These wont reflect modifiedTime, but that's ok?
	//log.debug(`Changes detected in document with id:${_id}`);
	//log.debug(`Changes detected in document with id:${_id} existingNode:${toStr(existingNode)} documentToDiff:${toStr(documentToDiff)}`);
	//log.debug(`Changes detected in document with id:${_id} diff:${toStr(Diff.diffJson(existingNode, documentToDiff))}`);
	log.debug(`Changes detected in document with id:${_id} diff:${toStr(detailedDiff(existingNode, documentToDiff))}`);
	//log.debug(`Changes detected in document with id:${_id} diff:${toStr(diffDocument(existingNode, documentToDiff))}`);

	//──────────────────────────────────────────────────────────────────────────
	// Since changes detected
	// 5b. Apply types
	//──────────────────────────────────────────────────────────────────────────
	const documentWithType = documentToDiff; // No need to deref since we're not using documentToDiff after this point...
	//log.debug(`documentWithType:${toStr(documentWithType)}`);

	checkAndApplyTypes({
		boolRequireValid,
		boolValid, // passed as value, not possible to modify, return instead
		fields,
		mode: 'update', // NOTE: Both type-checking and applying types (TODO: type-checking already done, could be skipped here)
		inputObject: JSON.parse(JSON.stringify(documentWithType)), // only traversed within function
		objToPersist: documentWithType // modified within function
	});

	//──────────────────────────────────────────────────────────────────────────
	// 5b. apply NEW modifiedTime and _indexConfig for modifiedTime
	//──────────────────────────────────────────────────────────────────────────
	documentWithType[FIELD_PATH_META].modifiedTime = instant(now);

	const indexConfigForModifiedTime = {
		path: `${FIELD_PATH_META}.modifiedTime`,
		config: indexTemplateToConfig({
			template: FIELD_MODIFIED_TIME_INDEX_CONFIG,
			indexValueProcessors: [],
			languages: []
		})
	};

	// Since FIELD_PATH_META.modifiedTime is deleted earlier this if should not be necessary
	if (!documentWithType._indexConfig.configs.filter(({path}) => path === `${FIELD_PATH_META}.modifiedTime`).length) {
		documentWithType._indexConfig.configs.push(indexConfigForModifiedTime);
	}

	const updatedNode = connection.modify({
		key: _id,
		editor: () => {
			return documentWithType;
		}
	});
	//log.info(`updatedNode:${toStr(updatedNode)}`);

	if (!documentTypeObj) {
		documentTypeObj = getDocumentTypeFromCollectionName({collectionName});
	}
	//log.debug(`document.update documentTypeObj:${toStr(documentTypeObj)}`);

	maybeAddFields({
		documentType: documentTypeObj,
		node: updatedNode
	});

	return updatedNode;
}
