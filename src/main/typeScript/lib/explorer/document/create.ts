//──────────────────────────────────────────────────────────────────────────────
//
// I want as much of the code as possible to be testable outside Enonic XP.
// A good way to achieve this is higher order programming.
// Any time a java lib or global is required, it must be passed in as a function,
// so it can be stubbed/mocked during testing.
//
//──────────────────────────────────────────────────────────────────────────────
//
// createDocument is a function that takes
//  data (to be cleaned, validated, typeCasted and persisted)
//  options (how to clean, validate and typeCast, where to persist)
//
// ┌ inputs ─┐
// │         ├ collectionConnection (Enonic doesn't reuse connections, so lets connect insice create instead)
// │         ├ collectionId -> collectionName, (language -> stemmingLanguage)
// │         ├ collectorId
// │         ├ collectorVersion
// │         ├ data
// │         ├ documentTypeId -> documentTypeName, fields
// │         └ explorerConnection (Enonic doesn't reuse connections, so lets connect insice create instead)
// ├ options ┐
// │         ├ addExtraFields
// │         ├ cleanExtraFields
// │         ├ requireValid
// │         ├ validateOccurrences
// │         └ validateTypes
// └ outputs ┐
//           ├ documentNode (created/modified)
//           └ documentTypeNode (modified) (if created need to update collectionNode too, since we have the collectionId, that is actually possible)
//──────────────────────────────────────────────────────────────────────────────
import type {JavaBridge} from '../types.d';
import type {CollectionNode} from '../collection/types.d';
import type {DocumentTypeNode} from '../documentType/types.d';
import type {CreateParameterObject} from './types';

import {
	forceArray,
	isNotSet as notSet,
	isSet,
	isString,
	isUuidV4String,
	sortKeys,
	toStr
} from '@enonic/js-utils';

import {
	BRANCH_ID_EXPLORER,
	COLLECTION_REPO_PREFIX,
	FIELD_PATH_META,
	PRINCIPAL_EXPLORER_READ,
	PRINCIPAL_EXPLORER_WRITE,
	REPO_ID_EXPLORER
} from '../constants';
import {addExtraFieldsToDocumentType} from './addExtraFieldsToDocumentType';
import {buildIndexConfig} from './buildIndexConfig';
import {cleanData} from './cleanData';
import {javaBridgeDummy} from './dummies';
import {fieldsArrayToObj} from './field';
import {validate} from './validate';
import {typeCastToJava} from './typeCastToJava';


// dieOnError
export function create(
	createParameterObject :CreateParameterObject,
	javaBridge :JavaBridge = javaBridgeDummy
) {
	if (notSet(createParameterObject)) {
		throw new Error('create: parameter object is missing!');
	}
	let {
		// Inputs
		collectionId,
		collectionName, // If empty gotten from collectionNode via collectionId
		collectorId,
		collectorVersion,
		data = {},
		documentTypeId, // If empty gotten from collectionNode via collectionId
		documentTypeName, // If empty gotten from documentTypeNode via documentTypeId
		fields, // If empty gotten from documentTypeNode
		language, // If empty gotten from collectionNode
		stemmingLanguage, // If empty gotten from language

		// Options
		cleanExtraFields = false, // If true, extra fields can't cause error nor addType, because extra fields are deleted.
		//denyExtraFields = cleanExtraFields, // If false, extra fields cause error and not persisted
		addExtraFields = !cleanExtraFields, // Extra fields are always added as string
		requireValid = false,
		validateOccurrences = false,
		validateTypes = requireValid
	} = createParameterObject;

	const {
		//connect, // destructure destroys this
		log,
		stemmingLanguageFromLocale
	} = javaBridge;
	//log.debug(`collectionId:${collectionId}`);
	//log.debug(`collectionName:${collectionName}`);
	//log.debug(`collectorId:${collectorId}`);
	//log.debug(`collectorVersion:${collectorVersion}`);
	//log.debug(`data:${toStr(data)}`);
	//log.debug(`documentTypeId:${documentTypeId}`);
	//log.debug(`documentTypeName:${documentTypeName}`);
	//log.debug(`fields:${toStr(fields)}`);
	//log.debug(`language:${language}`);
	//log.debug(`stemmingLanguage:${stemmingLanguage}`);

	//log.debug(`addExtraFields:${addExtraFields}`);
	//log.debug(`validateOccurrences:${validateOccurrences}`);
	//log.debug(`validateTypes:${validateTypes}`);

	//──────────────────────────────────────────────────────────────────────────
	// Checking required parameters
	//──────────────────────────────────────────────────────────────────────────
	if (
		notSet(collectionName) &&
		notSet(collectionId)
	) {
		throw new Error("create: either provide collectionName or collectionId!");
	}

	if (
		notSet(documentTypeName) &&
		notSet(documentTypeId) &&
		notSet(collectionId)
	) {
		throw new Error("create: either provide documentTypeName, documentTypeId or collectionId!");
	}

	if (
		notSet(fields) &&
		notSet(documentTypeId) &&
		notSet(collectionId)
	) {
		throw new Error("create: either provide fields, documentTypeId or collectionId!");
	}

	if (notSet(collectorId)) {
		throw new Error("create: required parameter 'collectorId' is missing!");
	}

	if (notSet(collectorVersion)) {
		throw new Error("create: required parameter 'collectorVersion' is missing!");
	}

	//──────────────────────────────────────────────────────────────────────────
	// Checking type of provided parameters
	//──────────────────────────────────────────────────────────────────────────
	if (
		isSet(collectionId) &&
		!isUuidV4String(collectionId)
	) {
		throw new TypeError("create: parameter 'collectionId' is not an uuidv4 string!");
	}

	if (
		isSet(collectionName) &&
		!isString(collectionName)
	) {
		throw new TypeError("create: parameter 'collectionName' is not a string!");
	}

	if (!isString(collectorId)) {
		throw new TypeError("create: parameter 'collectorId' is not a string!");
	}

	if (!isString(collectorVersion)) {
		throw new TypeError("create: parameter 'collectorVersion' is not a string!");
	}

	if (
		isSet(documentTypeName) &&
		!isString(documentTypeName)
	) {
		throw new TypeError("create: parameter 'documentTypeName' is not a string!");
	}

	if (
		isSet(documentTypeId) &&
		!isString(documentTypeId)
	) {
		throw new TypeError("create: parameter 'documentTypeId' is not a string!");
	}

	//──────────────────────────────────────────────────────────────────────────
	// Get values from provided parameters
	//──────────────────────────────────────────────────────────────────────────

	if (
		notSet(collectionName) ||
		notSet(documentTypeName) ||
		notSet(fields) ||
		notSet(language)
	) {
		log.debug('connecting to explorerRepo');
		const explorerReadConnection = javaBridge.connect({
			branch: BRANCH_ID_EXPLORER,
			principals: [PRINCIPAL_EXPLORER_READ],
			repoId: REPO_ID_EXPLORER
		});
		if (notSet(collectionName) || notSet(documentTypeId) || notSet(language)) {
			//log.debug('collectionId:%s', collectionId);

			const collectionNode = explorerReadConnection.get(collectionId) as CollectionNode;
			//log.debug('collectionNode:%s', collectionNode);

			if (notSet(collectionName)) {
				collectionName = collectionNode['_name'];
			}

			if (notSet(documentTypeId)) {
				documentTypeId = collectionNode['documentTypeId'];
			}

			if(notSet(language)) {
				language = collectionNode['language'];
			}
		}
		if (notSet(documentTypeName) || notSet(fields)) {
			const documentTypeNode = explorerReadConnection.get(documentTypeId) as DocumentTypeNode;
			if (notSet(documentTypeName)) {
				documentTypeName = documentTypeNode['_name'];
			}
			if (notSet(fields)) {
				fields = forceArray(documentTypeNode['properties']);
				//log.debug(`create() fields:${toStr(fields)}`);
			}
		}
	}

	//──────────────────────────────────────────────────────────────────────────

	if(notSet(stemmingLanguage) && isSet(language)) {
		stemmingLanguage = stemmingLanguageFromLocale(language);
	}

	//let myFields = JSON.parse(JSON.stringify(fields));
	let fieldsObj = fieldsArrayToObj(fields, javaBridge);
	//log.debug(`fieldsObj:${toStr(fieldsObj)}`);

	if (addExtraFields) {
		fieldsObj = addExtraFieldsToDocumentType({
			data,
			documentTypeId,
			fieldsObj,
		}, javaBridge);
	}
	//log.debug(`fieldsObj:${toStr(fieldsObj)}`);

	const cleanedData = cleanData({
		cleanExtraFields,
		data,
		fieldsObj
	}, javaBridge);
	//log.debug(`cleanedData:${toStr(cleanedData)}`);

	const isValid = validate({
		data: cleanedData,
		fieldsObj,
		validateOccurrences,
		validateTypes
	}, javaBridge);
	//log.debug(`isValid:${toStr(isValid)}`);
	if (requireValid && !isValid) {
		throw new Error(`validation failed! requireValid:${requireValid} validateOccurrences:${validateOccurrences} validateTypes:${validateTypes} cleanedData:${toStr(cleanedData)} fieldsObj:${toStr(fieldsObj)}`);
	}

	const dataWithJavaTypes = typeCastToJava({
		data: cleanedData,
		fieldsObj
	}, javaBridge);
	//log.debug('dataWithJavaTypes %s', dataWithJavaTypes);

	const languages :string[] = [];
	if (stemmingLanguage) {
		languages.push(stemmingLanguage);
	}

	const indexConfig = buildIndexConfig({
		//data,
		fieldsObj,
		languages
	}/*, javaBridge*/);
	//log.debug('indexConfig %s', indexConfig);
	dataWithJavaTypes['_indexConfig'] = indexConfig;

	dataWithJavaTypes[FIELD_PATH_META] = {
		collection: collectionName,
		collector: {
			id: collectorId,
			version: collectorVersion
		},
		createdTime: new Date(),
		documentType: documentTypeName,
		language,
		stemmingLanguage,
		valid: isValid
	};

	const sortedDataWithIndexConfig = sortKeys(dataWithJavaTypes);
	//log.debug('sortedDataWithIndexConfig %s', sortedDataWithIndexConfig);

	const repoId = `${COLLECTION_REPO_PREFIX}${collectionName}`;
	//log.debug('repoId:%s', repoId);

	//log.debug('connecting to repoId:%s', repoId);
	const collectionRepoWriteConnection = javaBridge.connect({
		branch: 'master',
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId
	});

	//log.debug('creating node:%s', sortedDataWithIndexConfig);
	return collectionRepoWriteConnection.create(sortedDataWithIndexConfig);
}
