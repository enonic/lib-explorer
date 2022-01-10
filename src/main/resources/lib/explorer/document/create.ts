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
import type {
	CreateEnonicJavaBridge,
	CreateParameterObject,
	LooseObject
} from './types';

import {
	isNotSet as notSet,
	isString,
	isUuidV4String,
	toStr
} from '@enonic/js-utils';

import {
	BRANCH_ID_EXPLORER,
	FIELD_PATH_META,
	PRINCIPAL_EXPLORER_READ,
	//PRINCIPAL_EXPLORER_WRITE,
	REPO_ID_EXPLORER
} from '../constants';
//import {addExtraFieldsToDocumentType} from './addExtraFieldsToDocumentType';
//import {cleanData} from './cleanData';
import {
	connectDummy,
	/*geoPointDummy,
	geoPointStringDummy,
	instantDummy,
	localDateDummy,
	localDateTimeDummy,
	localTimeDummy,*/
	logDummy,
	stemmingLanguageFromLocaleDummy/*,
	referenceDummy*/
} from './dummies';
/*import {
	fieldsArrayToObj,
	fieldsObjToArray
} from './field';
import {validate} from './validate';
import {typeCastToJava} from './typeCastToJava';*/


// dieOnError
export function create(createParameterObject :CreateParameterObject, {
	connect = connectDummy,
	log = logDummy,
	stemmingLanguageFromLocale = stemmingLanguageFromLocaleDummy/*,
	geoPoint = geoPointDummy,
	geoPointString = geoPointStringDummy,
	instant = instantDummy,
	localDate = localDateDummy,
	localDateTime = localDateTimeDummy,
	localTime = localTimeDummy,
	reference = referenceDummy*/
} :Partial<CreateEnonicJavaBridge> = {} ) {
	if (notSet(createParameterObject)) {
		throw new Error('create: parameter object is missing!');
	}
	let {
		// Inputs
		collectionId,
		collectionName, // If empty gotten from collectionNode via collectionId
		collectorId,
		collectorVersion,
		data,
		documentTypeId, // If empty gotten from collectionNode via collectionId
		documentTypeName, // If empty gotten from documentTypeNode via documentTypeId
		fields = [], // if empty gotten from documentTypeNode
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
	//log.debug(`collectionId:${collectionId}`);
	//log.debug(`collectionName:${collectionName}`);
	//log.debug(`collectorId:${collectorId}`);
	//log.debug(`collectorVersion:${collectorVersion}`);
	log.debug(`data:${toStr(data)}`);
	//log.debug(`documentTypeId:${documentTypeId}`);
	//log.debug(`documentTypeName:${documentTypeName}`);
	log.debug(`fields:${toStr(fields)}`);
	//log.debug(`language:${language}`);
	//log.debug(`stemmingLanguage:${stemmingLanguage}`);

	log.debug(`addExtraFields:${addExtraFields}`);
	log.debug(`validateOccurrences:${validateOccurrences}`);
	log.debug(`validateTypes:${validateTypes}`);

	if (notSet(collectionId)) {
		throw new Error("create: required parameter 'collectionId' is missing!");
	} else if (!isUuidV4String(collectionId)) {
		throw new TypeError("create: parameter 'collectionId' is not an uuidv4 string!");
	}

	if (notSet(collectorId)) {
		throw new Error("create: required parameter 'collectorId' is missing!");
	} else if (!isString(collectorId)) {
		throw new TypeError("create: parameter 'collectorId' is not a string!");
	}

	if (notSet(collectorVersion)) {
		throw new Error("create: required parameter 'collectorVersion' is missing!");
	} else if (!isString(collectorVersion)) {
		throw new TypeError("create: parameter 'collectorVersion' is not a string!");
	}

	const explorerReadConnection = connect({
		branch: BRANCH_ID_EXPLORER,
		principals: [PRINCIPAL_EXPLORER_READ],
		repoId: REPO_ID_EXPLORER
	});

	if (notSet(collectionName) || notSet(documentTypeId) || notSet(language)) {
		let collectionNode :LooseObject;
		collectionNode = explorerReadConnection.get(collectionId) as LooseObject;

		if (notSet(collectionName)) {
			collectionName = collectionNode['_name'] as string;
		}

		if (notSet(documentTypeId)) {
			documentTypeId = collectionNode['documentTypeId'] as string;
		}

		if(notSet(language)) {
			language = collectionNode['language'] as string;
		}
	}

	if (notSet(documentTypeName)) {
		const documentTypeNode = explorerReadConnection.get(documentTypeId) as LooseObject;
		documentTypeName = documentTypeNode['_name'] as string;
	}

	if(notSet(stemmingLanguage)) {
		stemmingLanguage = stemmingLanguageFromLocale(language);
	}

	//let myFields = JSON.parse(JSON.stringify(fields));
	/*let fieldsObj = fieldsArrayToObj(fields, {log});
	if (addExtraFields) {
		fieldsObj = addExtraFieldsToDocumentType({
			data,
			fieldsObj,
			updateDocumentType: () => {} // TODO
		}, { log });
	}
	const cleanedData = cleanData({
		cleanExtraFields,
		data,
		fieldsObj
	}, {log});
	/*if (!cleanExtraFields && denyExtraFields) {

	}/
	const myFields = fieldsObjToArray(fieldsObj);
	const isValid = validate({
		data: cleanedData,
		fields: myFields,
		validateOccurrences,
		validateTypes
	}, {log});
	const dataWithJavaTypes = typeCastToJava({
		data: cleanedData,
		fields: myFields
	}, { // Java objects and functions
		log,
		geoPoint,
		geoPointString,
		instant,
		localDate,
		localDateTime,
		localTime,
		reference
	});
	dataWithJavaTypes[FIELD_PATH_META]['collection'] = collectionName;*/
	/*const dataWithMetadata = addMetaData({
		//branchName
		//collectionId <- repoName:branchName:collectionId
		collection // <- collectionName, // Collections can be renamed :(
		collector: {
			id,
			version
		},
		createdTime,
		//creator,
		data,
		//documentTypeId <- repoName:branchName:documentTypeId
		documentType, // <- documentTypeName,
		language,
		modifiedTime,
		//repoName
		//owner,
		stemmingLanguage,
		valid,
	});
	const dataWithIndexConfig = addIndexConfig({data, fields});*/
	//return dataWithJavaTypes;
	return {
		[FIELD_PATH_META]: {
			collection: collectionName,
			collector: {
				id: collectorId,
				version: collectorVersion
			},
			documentType: documentTypeName,
			language,
			stemmingLanguage
		}
	};
}
