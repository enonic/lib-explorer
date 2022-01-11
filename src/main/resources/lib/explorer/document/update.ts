import type {
	LooseObject,
	UpdatedNode
} from '../types';
import type {
	Fields,
	UpdateEnonicJavaBridge,
	UpdateParameterObject
} from './types';

import {
	isNotSet as notSet,
	isObject,
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


export function update(
	updateParameterObject :UpdateParameterObject,
	{
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
	} :Required<UpdateEnonicJavaBridge>
) {
	if (notSet(updateParameterObject)) {
		throw new Error('update: parameter object is missing!');
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
		modifiedTime, // Useful when testing
		stemmingLanguage, // If empty gotten from language

		// Options
		cleanExtraFields = false, // If true, extra fields can't cause error nor addType, because extra fields are deleted.
		//denyExtraFields = cleanExtraFields, // If false, extra fields cause error and not persisted
		addExtraFields = !cleanExtraFields, // Extra fields are always added as string
		requireValid = false,
		validateOccurrences = false,
		validateTypes = requireValid
	} = updateParameterObject;
	//──────────────────────────────────────────────────────────────────────────
	// Checking required parameters
	//──────────────────────────────────────────────────────────────────────────
	if (notSet(data)) {
		throw new Error("update: missing required parameter data!");
	}

	if (
		notSet(collectionName) &&
		notSet(collectionId)
	) {
		throw new Error("update: either provide collectionName or collectionId!");
	}

	if (
		notSet(documentTypeName) &&
		notSet(documentTypeId) &&
		notSet(collectionId)
	) {
		throw new Error("update: either provide documentTypeName, documentTypeId or collectionId!");
	}

	if (
		notSet(fields) &&
		notSet(documentTypeId) &&
		notSet(collectionId)
	) {
		throw new Error("update: either provide fields, documentTypeId or collectionId!");
	}

	if (notSet(collectorId)) {
		throw new Error("update: required parameter 'collectorId' is missing!");
	}

	if (notSet(collectorVersion)) {
		throw new Error("update: required parameter 'collectorVersion' is missing!");
	}

	//──────────────────────────────────────────────────────────────────────────
	// Checking type of provided parameters
	//──────────────────────────────────────────────────────────────────────────
	if (!isObject(data)) {
		throw new TypeError("update: parameter 'data' is not an Object!");
	}

	const {
		_id: documentNodeId
	} = data;
	if (notSet(documentNodeId)) {
		throw new Error("update: parameter data: missing required property '_id'!");
	} else if (!isUuidV4String(documentNodeId)){
		throw new TypeError("update: parameter data: property '_id' is not an uuidv4 string!");
	}

	if (
		isSet(collectionId) &&
		!isUuidV4String(collectionId)
	) {
		throw new TypeError("update: parameter 'collectionId' is not an uuidv4 string!");
	}

	if (
		isSet(collectionName) &&
		!isString(collectionName)
	) {
		throw new TypeError("update: parameter 'collectionName' is not a string!");
	}

	if (!isString(collectorId)) {
		throw new TypeError("update: parameter 'collectorId' is not a string!");
	}

	if (!isString(collectorVersion)) {
		throw new TypeError("update: parameter 'collectorVersion' is not a string!");
	}

	if (
		isSet(documentTypeName) &&
		!isString(documentTypeName)
	) {
		throw new TypeError("update: parameter 'documentTypeName' is not a string!");
	}

	if (
		isSet(documentTypeId) &&
		!isString(documentTypeId)
	) {
		throw new TypeError("update: parameter 'documentTypeId' is not a string!");
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
	}

	//──────────────────────────────────────────────────────────────────────────

	if(notSet(stemmingLanguage) && isSet(language)) {
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
		modifiedTime: modifiedTime || new Date(),
		stemmingLanguage,
		valid: isValid
	};

	const sortedDataWithIndexConfig = sortKeys(dataWithJavaTypes);
	//log.debug('sortedDataWithIndexConfig %s', sortedDataWithIndexConfig);

	const repoId = `${COLLECTION_REPO_PREFIX}${collectionName}`;
	//log.debug('repoId:%s', repoId);

	const collectionRepoWriteConnection = connect({
		branch: 'master',
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId
	});
	return collectionRepoWriteConnection.modify({
		key: documentNodeId as string,
		editor: () => {
			return sortedDataWithIndexConfig as UpdatedNode
		},
		node: sortedDataWithIndexConfig as UpdatedNode
	});
}
