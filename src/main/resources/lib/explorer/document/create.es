//──────────────────────────────────────────────────────────────────────────────
//
// I want as much of the code as possible to be testable outside Enonic XP.
// A good way to achieve this is higher order programming.
// Any time a java lib is required, it must be passed in as a function,
// so it can be stubbed/mocked during testing.
//
//──────────────────────────────────────────────────────────────────────────────
//
// createDocument is a function that takes
//  data (to be cleaned, validated, typeCasted and persisted)
//  options (how to clean, validate and typeCast, where to persist)
//
//──────────────────────────────────────────────────────────────────────────────


//──────────────────────────────────────────────────────────────────────────────
// The old implementation
//──────────────────────────────────────────────────────────────────────────────
import {
	indexTemplateToConfig,
	isNotSet,
	isObject,
	toStr
} from '@enonic/js-utils';

import {checkAndApplyTypes} from '/lib/explorer/document/checkAndApplyTypes';
import {checkOccurrencesAndBuildIndexConfig} from '/lib/explorer/document/checkOccurrencesAndBuildIndexConfig';
import {maybeAddFields} from '/lib/explorer/document/maybeAddFields';
import {getDocumentTypeFromCollectionName} from '/lib/explorer/documentType/getDocumentTypeFromCollectionName';
import {getFields} from '/lib/explorer/field/getFields';
import {
	FIELD_PATH_META,
	NT_DOCUMENT,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {javaLocaleToSupportedLanguage} from '/lib/explorer/stemming/javaLocaleToSupportedLanguage';
//import {getUser} from '/lib/xp/auth';


export function getFieldsWithIndexConfigAndValueType() {
	// Get all field defititions
	const fieldRes = getFields({
		connection: connect({
			principals: [PRINCIPAL_EXPLORER_READ]
		}),
		includeSystemFields: true
	});
	//log.debug(`fieldRes:${toStr(fieldRes)}`);

	const fields = {};
	fieldRes.hits.forEach(({
		//_name,
		fieldType,
		indexConfig, // can be template or full config
		isSystemField = false,
		key,
		min = 0, // Default is not required,
		max = 0 // Default is infinite
	}) => {
		if (key !== '_allText') {
			fields[key] = {
				indexConfig, // can be template or full config
				isSystemField,
				min,
				max,
				valueType: fieldType
			};
		}
	});
	//log.debug(`fields:${toStr(fields)}`);
	return fields;
}


export function create({
	_name, // NOTE if _name is missing, _name becomes same as generated _id
	...rest // NOTE can have nested properties, both Array and/or Object
}, {
	boolRequireValid,
	collectionName,
	connection,
	documentTypeObj,
	language,
	...ignoredOptions
} = {}) {
	Object.keys(rest).forEach((k) => {
		if (k.startsWith('__')) {
			log.warning(`Deprecation: Function signature changed. Added second argument for options.
		Old: document.create({${k}, ...})
		New: document.create({...}, {${k.substring(2)}})`);
			if(k === '__boolRequireValid') {
				if (isNotSet(boolRequireValid)) {
					boolRequireValid = rest[k];
				}
			} else if(k === '__connection') {
				if (isNotSet(connection)) {
					connection = rest[k];
				}
			} else {
				log.warning(`document.create: Ignored option:${k} value:${toStr(rest[k])}`);
			}
			delete rest[k];
		}
	});

	if (isNotSet(boolRequireValid)) {
		boolRequireValid = true;
	}

	if (Object.keys(ignoredOptions).length) {
		log.warning(`document.create: Ignored options:${toStr(ignoredOptions)}`);
	}

	const inputObject = JSON.parse(JSON.stringify(rest)); // ERROR JSON.stringify got a cyclic data structure
	//delete inputObject._indexConfig;

	if (isNotSet(inputObject[FIELD_PATH_META])) {
		inputObject[FIELD_PATH_META] = {};
	} else if (!isObject(inputObject[FIELD_PATH_META])) {
		log.error(`${FIELD_PATH_META} has to be an Object! Overwriting:${toStr(inputObject[FIELD_PATH_META])}`);
		inputObject[FIELD_PATH_META] = {};
	}

	/*──────────────────────────────────────────────────────────────────────────
	 Test if _indexconfig is added? SUCCESS :)
	 Test unwanted properties in FIELD_PATH_META? SUCCESS :) They are not added.
	{
	  [FIELD_PATH_META]: {
	    collector: {
		  id: 'collectorId',
		  version: '1.2.3'
	    },
		createdTime: "2021-01-01T01:01:01.001Z", // should keep current value
		modifiedTime: "2021-01-01T01:01:01.001Z", // should not exist
		language: "en-US",
		stemmingLanguage: "should be overwritten",
		valid: true, // should be result of validation, not what is passed in
		unwanted: "should not exist"
	  }
	}
	──────────────────────────────────────────────────────────────────────────*/

	// Delete any property under FIELD_PATH_META except collector and language
	//log.debug(`inputObject[FIELD_PATH_META]:${toStr(inputObject[FIELD_PATH_META])}`);
	Object.keys(inputObject[FIELD_PATH_META]).forEach((k) => {
		if (!['collector', 'language'].includes(k)) {
			delete inputObject[FIELD_PATH_META][k];
		}
	});
	//log.debug(`inputObject[FIELD_PATH_META]:${toStr(inputObject[FIELD_PATH_META])}`);

	// NOTE: There are now two ways of passing in the language :(
	//   1. As a option parameter
	//   2. Via FIELD_PATH_META.language
	// We only want to support a single language per node (and reduce that to a single supported stemmingLanguage)
	// It's possible to select a single language per collection, however some collections use different languages per node.
	// Currently the option parameter comes from the collectionLanguage,
	// while the FIELD_PATH_META is node specific and should override the option one.

	if (!inputObject[FIELD_PATH_META].language && language) {
		inputObject[FIELD_PATH_META].language = language;
	}

	// _indexconfig is added automatically :)
	if (inputObject[FIELD_PATH_META].language) {
		// TODO We might want to cache language->stemmingLanguage somewhere
		inputObject[FIELD_PATH_META].stemmingLanguage = javaLocaleToSupportedLanguage(inputObject[FIELD_PATH_META].language);
	}

	inputObject[FIELD_PATH_META].valid = true; // Temporary value so validation doesn't fail on this field.
	inputObject[FIELD_PATH_META].createdTime = new Date(); // So validation doesn't fail on this field.

	// Fields starting with underscore are not handeled by checkAndApplyTypes,
	// Because we want full control over them. Same with FIELD_PATH_META...
	const objToPersist = {
		_name,
		_inheritsPermissions: true,
		_nodeType: NT_DOCUMENT, // Enforce type
		_parentPath: '/'//, // Enforce flat structure
		//_permissions: []
	};

	/*const user = getUser();
	if (!user) { // CreateNode tries to set owner, and fails when no user
		throw new Error('libAuth.getUser failed, wrap with libContext.run with valid user!');
	}*/

	const fields = getFieldsWithIndexConfigAndValueType();

	const languages = [];
	if (inputObject[FIELD_PATH_META].stemmingLanguage) {
		languages.push(inputObject[FIELD_PATH_META].stemmingLanguage);
	}
	const indexConfig = {
		default: indexTemplateToConfig({
			template: 'byType', // TODO Perhaps minimal?
			indexValueProcessors: [],
			languages
		}),
		configs: [/*{
			path: FIELD_PATH_META,
			config: indexTemplateToConfig({
				template: 'minimal',
				indexValueProcessors: [],
				languages: []
			})
		}*/]
	};

	// 1nd "pass":
	// Skip checking occurrences, since that is checked in 2nd "pass".
	// Check types, since that is skipped in 2nd "pass".
	let boolValid = checkAndApplyTypes({
		boolRequireValid,
		boolValid: true,
		fields,
		inputObject, // only traversed within function
		mode: 'create',
		objToPersist // modified within function
	});

	// 2nd "pass":
	// * Check if all required fields have values.
	// * Check if any field have too many values.
	// * Skipping type checking, since that was skipped in 1st "pass".
	// * Build indexConfig for any field with a value.
	try {
		checkOccurrencesAndBuildIndexConfig({
			boolRequireValid,
			fields,
			indexConfig, // modified within function
			inputObject: objToPersist, // only read from within function
			language: inputObject[FIELD_PATH_META].stemmingLanguage
		});
	} catch (e) {
		if (boolRequireValid) {
			throw e;
		} else {
			boolValid = false;
			//log.warning(e.message); // Already logged within function
		}
	}
	//log.debug(`indexConfig:${toStr(indexConfig)}`);

	objToPersist._indexConfig = indexConfig;
	objToPersist[FIELD_PATH_META].valid = boolValid;

	//log.debug(`nodeToCreate:${toStr(nodeToCreate)}`);
	const createdNode = connection.create(objToPersist);
	//log.debug(`createdNode:${toStr(createdNode)}`);

	if (!documentTypeObj) {
		documentTypeObj = getDocumentTypeFromCollectionName({collectionName});
	}
	//log.debug(`document.create documentTypeObj:${toStr(documentTypeObj)}`);

	maybeAddFields({
		documentType: documentTypeObj,
		node: createdNode
	});

	return createdNode;
}
