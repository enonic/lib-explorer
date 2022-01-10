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
	Fields,
	LooseObject
} from './types';

import {
	isNotSet as notSet,
	isString,
	isUuidV4String,
	sortKeys,
	toStr
} from '@enonic/js-utils';

import {
	BRANCH_ID_EXPLORER,
	FIELD_PATH_META,
	PRINCIPAL_EXPLORER_READ,
	//PRINCIPAL_EXPLORER_WRITE,
	REPO_ID_EXPLORER
} from '../constants';
import {addExtraFieldsToDocumentType} from './addExtraFieldsToDocumentType';
import {buildIndexConfig} from './buildIndexConfig';
import {cleanData} from './cleanData';
import {
	connectDummy,
	geoPointDummy,
	geoPointStringDummy,
	instantDummy,
	localDateDummy,
	localDateTimeDummy,
	localTimeDummy,
	logDummy,
	stemmingLanguageFromLocaleDummy,
	referenceDummy
} from './dummies';
import {fieldsArrayToObj} from './field';
import {validate} from './validate';
import {typeCastToJava} from './typeCastToJava';


// dieOnError
export function create(createParameterObject :CreateParameterObject, {
	connect = connectDummy,
	log = logDummy,
	geoPoint = geoPointDummy,
	geoPointString = geoPointStringDummy,
	instant = instantDummy,
	localDate = localDateDummy,
	localDateTime = localDateTimeDummy,
	localTime = localTimeDummy,
	reference = referenceDummy,
	stemmingLanguageFromLocale = stemmingLanguageFromLocaleDummy
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
		createdTime, // Useful when testing
		data,
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

	if (notSet(documentTypeName) || notSet(fields)) {
		const documentTypeNode = explorerReadConnection.get(documentTypeId) as LooseObject;
		if (notSet(documentTypeName)) {
			documentTypeName = documentTypeNode['_name'] as string;
		}
		if (notSet(fields)) {
			fields = documentTypeNode['properties'] as Fields;
			//log.debug(`fields:${toStr(fields)}`);
		}
	}

	if(notSet(stemmingLanguage)) {
		stemmingLanguage = stemmingLanguageFromLocale(language);
	}

	//let myFields = JSON.parse(JSON.stringify(fields));
	let fieldsObj = fieldsArrayToObj(fields, {log});
	//log.debug(`fieldsObj:${toStr(fieldsObj)}`);

	if (addExtraFields) {
		fieldsObj = addExtraFieldsToDocumentType({
			data,
			fieldsObj,
			updateDocumentType: () => {} // TODO
		}, { log });
	}
	//log.debug(`fieldsObj:${toStr(fieldsObj)}`);

	const cleanedData = cleanData({
		cleanExtraFields,
		data,
		fieldsObj
	}, {log});
	//log.debug(`cleanedData:${toStr(cleanedData)}`);

	const isValid = validate({
		data: cleanedData,
		fieldsObj,
		validateOccurrences,
		validateTypes
	}, {log});
	//log.debug(`isValid:${toStr(isValid)}`);
	if (requireValid && !isValid) {
		throw new Error(`validation failed! requireValid:${requireValid} validateOccurrences:${validateOccurrences} validateTypes:${validateTypes} cleanedData:${toStr(cleanedData)} fieldsObj:${toStr(fieldsObj)}`);
	}

	const dataWithJavaTypes = typeCastToJava({
		data: cleanedData,
		fieldsObj
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
	//log.debug('dataWithJavaTypes %s', dataWithJavaTypes);

	const languages :string[] = [];
	if (stemmingLanguage) {
		languages.push(stemmingLanguage);
	}

	const indexConfig = buildIndexConfig({
		//data,
		fieldsObj,
		languages
	}, {log});
	//log.debug('indexConfig %s', indexConfig);
	dataWithJavaTypes['_indexConfig'] = indexConfig;

	dataWithJavaTypes[FIELD_PATH_META] = {
		collection: collectionName,
		collector: {
			id: collectorId,
			version: collectorVersion
		},
		createdTime: createdTime || new Date(),
		documentType: documentTypeName,
		language,
		stemmingLanguage,
		valid: isValid
	};

	const sortedDataWithIndexConfig = sortKeys(dataWithJavaTypes);
	//log.debug('sortedDataWithIndexConfig %s', sortedDataWithIndexConfig);

	return sortedDataWithIndexConfig;
}
