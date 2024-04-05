import type {JavaBridge} from '/lib/explorer/_coupling/types.d';
import type {CollectionNode} from '/lib/explorer/types/Collection.d';
import type {
	DocumentNode,
	RequiredMetaData
} from '/lib/explorer/types/Document.d';
import {
	DocumentTypeNode,
	Path,
	ParentPath
} from '/lib/explorer/types/index.d';
import type {CreateParameterObject} from './create';


import {connect} from '/lib/xp/node';
import {
	forceArray,
	//isDate,
	isInstantString,
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
	REPO_ID_EXPLORER,
	ROOT_PERMISSIONS_EXPLORER
} from '/lib/explorer/constants';
import {javaLocaleToSupportedLanguage as stemmingLanguageFromLocale} from '/lib/explorer/stemming/javaLocaleToSupportedLanguage';
import {documentTypeNameToPath} from '../documentType/documentTypeNameToPath';
import {addExtraFieldsToDocumentType} from './addExtraFieldsToDocumentType';
import {buildIndexConfig} from './buildIndexConfig';
import {cleanData} from './cleanData';
import {constrainPropertyNames} from './constrainPropertyNames';
import {documentUnchanged} from './documentUnchanged';
import {fieldsArrayToObj} from './field';
import {validate} from './validate';
import {typeCastToJava} from './typeCastToJava';


export interface UpdateParameterObject extends CreateParameterObject {
	data?: {
		_id?: string
		_name?: string
		_parentPath?: ParentPath
		_path?: Path
		[key: PropertyKey]: unknown
	}
	partial?: boolean
}


export function update(
	updateParameterObject: UpdateParameterObject,
) {
	if (notSet(updateParameterObject)) {
		throw new Error('update: parameter object is missing!');
	}
	const {
		// Inputs
		collectionId,
		collectorId,
		collectorVersion,
		data = {},
		// Options
		cleanExtraFields = false, // If true, extra fields can't cause error nor addType, because extra fields are deleted.
		//denyExtraFields = cleanExtraFields, // If false, extra fields cause error and not persisted
		addExtraFields = !cleanExtraFields, // Extra fields are always added as string
		//partial = false,
		requireValid = false,
		validateOccurrences = false,
		validateTypes = requireValid
	} = updateParameterObject
	let {
		// Inputs
		collectionName, // If empty gotten from collectionNode via collectionId
		documentTypeId, // If empty gotten from documentTypeName or fallback to collectionNode via collectionId
		documentTypeName, // Is now a required parameter for collectors, but not the document API.
		fields, // If empty gotten from documentTypeNode
		language, // If empty gotten from collectionNode
		stemmingLanguage, // If empty gotten from language
	} = updateParameterObject;
	// log.debug('document.update: collectionId:%s', collectionId);
	// log.debug('document.update: collectionName:%s', collectionName);
	// log.debug('document.update: collectorId:%s', collectorId);
	// log.debug('document.update: collectorVersion:%s', collectorVersion);
	// log.debug('document.update: data:%s', toStr(data));
	// log.debug('document.update: documentTypeId:%s', documentTypeId);
	// log.debug('document.update: documentTypeName:%s', documentTypeName);
	// log.debug('document.update: fields:%s', toStr(fields));
	// log.debug('document.update: language:%s', language);
	// log.debug('document.update: stemmingLanguage:%s', stemmingLanguage);

	// log.debug('document.update: addExtraFields:%s', addExtraFields);
	// log.debug('document.update: cleanExtraFields:%s', cleanExtraFields);
	// log.debug('document.update: partial:%s', partial);
	// log.debug('document.update: requireValid:%s', requireValid);
	// log.debug('document.update: validateOccurrences:%s', validateOccurrences);
	// log.debug('document.update: validateTypes:%s', validateTypes);
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
		_id: documentNodeId,
		//_name: documentNodeName,
		//_parentPath: documentNodeParentPath = '/',
		//_path: documentNodePath = documentNodeName ? `${documentNodeParentPath}${documentNodeName}` : undefined
	} = data;
	//const documentNodeKey = documentNodeId || documentNodePath;

	if (notSet(documentNodeId)) {
		throw new Error("update: parameter data: missing required property '_id'!");
	} else if (!isUuidV4String(documentNodeId)) {
		log.error("update: parameter data: property '_id' is not an uuidv4 string! _id:%s", toStr(documentNodeId));
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
	// Get derived "parameters" from provided parameters
	//──────────────────────────────────────────────────────────────────────────
	// At this point the required parameters are provided and of the correct
	// type. From the provided parameters we now get derived parameters.
	//
	// if documentTypeId is provided it supersedes documentTypeName
	// if documentTypeName is provided it supersedes 'Default document type' aka collectionNode.documentTypeId

	if (
		documentTypeId ||
		notSet(collectionName) ||
		notSet(documentTypeName) ||
		notSet(fields) ||
		notSet(language)
	) {
		log.debug('document.update: connecting to repoId:%s branch:%s with principals:%s', REPO_ID_EXPLORER, BRANCH_ID_EXPLORER, toStr([PRINCIPAL_EXPLORER_READ]));
		const explorerReadConnection = connect({
			branch: BRANCH_ID_EXPLORER,
			principals: [PRINCIPAL_EXPLORER_READ],
			repoId: REPO_ID_EXPLORER
		});

		let documentTypeNode: DocumentTypeNode;
		if (documentTypeId) {
			documentTypeNode = explorerReadConnection.get(documentTypeId);
			// log.debug("document.update: documentTypeNode(A):%s", toStr(documentTypeNode));
			if (documentTypeName && documentTypeName !== documentTypeNode._name) {
				log.warning('documentTypeNode._name:%s from documentTypeId:%s supersedes passed in documentTypeName:%s', documentTypeNode._name, documentTypeId, documentTypeName);
			}
			documentTypeName = documentTypeNode._name;
			log.debug('document.update: sat documentTypeName:%s from documentTypeId:%s', documentTypeName, documentTypeId);
		} else if(
			//!documentTypeId &&
			documentTypeName
		) {
			const documentTypeNodePath = documentTypeNameToPath(documentTypeName);
			documentTypeNode = explorerReadConnection.get(documentTypeNodePath);
			// log.debug("document.update: documentTypeNode(B):%s", toStr(documentTypeNode));
			if (!documentTypeNode) {
				throw new Error(`Something went wrong when trying to get documentTypeId from documentTypeName:${documentTypeName} via path:${documentTypeNodePath}`);
			}
			documentTypeId = documentTypeNode._id;
			log.debug('document.update: sat documentTypeId:%s from documentTypeName:%s', documentTypeId, documentTypeName);
		}
		// At this point both documentTypeId and documentTypeName can still be undefined.

		if (notSet(collectionName) || notSet(documentTypeId) || notSet(language)) {
			const collectionNode = explorerReadConnection.get(collectionId) as CollectionNode;

			if (notSet(collectionName)) {
				collectionName = collectionNode['_name'];
			}

			if (notSet(documentTypeId)) {
				if (collectionNode['documentTypeId']) {
					documentTypeId = collectionNode['documentTypeId'].toString();
					log.debug('document.update: sat documentTypeId:%s from collectionNode.documentTypeId', documentTypeId);
				} else {
					// collectionNode.documentTypeId is now called 'Default document type' in the GUI, and can be set to 'none'.
					log.debug('document.update: collectionNode.documentTypeId is undefined');
				}
			}

			if(notSet(language)) {
				const languageFromCollection = collectionNode['language']; // This can be undefined
				if (languageFromCollection) {
					language = languageFromCollection;
					log.debug('document.update: sat language:%s from collectionNode.language', language);
				}
				// NOTE: When no language is provided anywhere, there should be no stemming.
			}
		}
		if (notSet(documentTypeName) || notSet(fields)) {
			if (!documentTypeNode) {
				if (!documentTypeId) {
					throw new Error(`Can't get documentTypeName or fields from documentTypeNode, since documentTypeId is undefined!`);
				}
				documentTypeNode = explorerReadConnection.get(documentTypeId); // This only happens when documentTypeId is gotten from fallback to 'Default document type'.
				// log.debug("document.update: documentTypeNode(C):%s", toStr(documentTypeNode));
			}
			if (notSet(documentTypeName)) {
				documentTypeName = documentTypeNode['_name'];
			}
			if (notSet(fields)) {
				fields = isSet(documentTypeNode['properties']) ? forceArray(documentTypeNode['properties']) : [];
				// log.debug(`fields:${toStr(fields)}`);
			}
		}
	}

	const repoId = `${COLLECTION_REPO_PREFIX}${collectionName}`;
	// log.debug('repoId:%s', repoId);

	const collectionRepoReadConnection = connect({
		branch: 'master',
		principals: [PRINCIPAL_EXPLORER_READ],
		repoId
	});
	const documentNode = collectionRepoReadConnection.get<DocumentNode>(documentNodeId);
	if (!documentNode) {
		throw new Error(`update: No document with _id:${documentNodeId}`);
	}
	// log.debug(`documentNode:${toStr(documentNode)}`);

	// This would break when updating exisiting data!
	/*if (notSet(documentNode[FIELD_PATH_META])) {
		throw new Error(`update: Document with _id:${documentNodeId} has no ${FIELD_PATH_META} property!`);
	}
	if (!isObject(documentNode[FIELD_PATH_META])) {
		throw new Error(`update: Document with _id:${documentNodeId} ${FIELD_PATH_META} is not an object!`);
	}
	if (notSet((documentNode[FIELD_PATH_META] as RequiredMetaData).createdTime)) {
		throw new Error(`update: Document with _id:${documentNodeId} has no ${FIELD_PATH_META}:${toStr(documentNode[FIELD_PATH_META])} has no createdTime property!`);
	}
	const createdTime = (documentNode[FIELD_PATH_META] as RequiredMetaData).createdTime;*/

	const createdTime = isObject(documentNode[FIELD_PATH_META]) && (documentNode[FIELD_PATH_META] as RequiredMetaData).createdTime
		? (documentNode[FIELD_PATH_META] as RequiredMetaData).createdTime
		: isInstantString(documentNode._ts)
			? documentNode._ts
			: new Date();

	//──────────────────────────────────────────────────────────────────────────

	if(notSet(stemmingLanguage) && isSet(language)) {
		stemmingLanguage = stemmingLanguageFromLocale(language);
	}

	//──────────────────────────────────────────────────────────────────────────

	// log.debug('document.update: collectionId:%s', collectionId);
	// log.debug('document.update: collectionName:%s', collectionName);
	// log.debug('document.update: collectorId:%s', collectorId);
	// log.debug('document.update: collectorVersion:%s', collectorVersion);
	// log.debug('document.update: data:%s', toStr(data));
	// log.debug('document.update: documentTypeId:%s', documentTypeId);
	// log.debug('document.update: documentTypeName:%s', documentTypeName);
	// log.debug('document.update: fields:%s', toStr(fields));
	// log.debug('document.update: language:%s', language);
	// log.debug('document.update: stemmingLanguage:%s', stemmingLanguage);

	//let myFields = JSON.parse(JSON.stringify(fields));
	let fieldsObj = fieldsArrayToObj(fields);
	// log.debug('document.update: fieldsObj:%s', toStr(fieldsObj));

	const dataWithConstrainedPropertyNames = constrainPropertyNames({
		data
	});

	if (addExtraFields) {
		fieldsObj = addExtraFieldsToDocumentType({
			data: dataWithConstrainedPropertyNames,
			documentTypeId,
			fieldsObj,
		});
	}
	// log.debug(`fieldsObj:${toStr(fieldsObj)}`);

	const cleanedData = cleanData({
		cleanExtraFields,
		data: dataWithConstrainedPropertyNames,
		fieldsObj
	});
	// log.debug(`cleanedData:${toStr(cleanedData)}`);

	const combinedData = {
		...JSON.parse(JSON.stringify(documentNode)),
		...cleanedData
	};
	// log.debug(`combinedData:${toStr(combinedData)}`);

	const isValid = validate({
		data: combinedData,
		fieldsObj,
		//partial, // Doing full validation since using combinedData
		validateOccurrences,
		validateTypes
	});
	// log.debug(`isValid:${toStr(isValid)}`);
	if (requireValid && !isValid) {
		throw new Error(`validation failed! requireValid:${requireValid} validateOccurrences:${validateOccurrences} validateTypes:${validateTypes} cleanedData:${toStr(cleanedData)} fieldsObj:${toStr(fieldsObj)}`);
	}

	const dataWithJavaTypes = typeCastToJava({
		data: combinedData,
		fieldsObj
	});
	// log.debug('dataWithJavaTypes %s', dataWithJavaTypes);

	const languages: string[] = [];
	if (stemmingLanguage) {
		languages.push(stemmingLanguage);
	}

	const indexConfig = buildIndexConfig({
		//data,
		fieldsObj,
		languages
	}/*, javaBridge*/);
	// log.debug('indexConfig %s', indexConfig);
	dataWithJavaTypes['_indexConfig'] = indexConfig;

	// This is needed to fix old broken permissions on re-collect:
	dataWithJavaTypes._inheritsPermissions = false; // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
	dataWithJavaTypes._permissions = ROOT_PERMISSIONS_EXPLORER;

	dataWithJavaTypes[FIELD_PATH_META] = {
		collection: collectionName,
		collector: {
			id: collectorId,
			version: collectorVersion
		},
		createdTime,
		documentType: documentTypeName,
		language,
		modifiedTime: new Date(),
		stemmingLanguage,
		valid: isValid
	};

	const sortedDataWithIndexConfig = sortKeys(dataWithJavaTypes);
	// log.debug('sortedDataWithIndexConfig %s', sortedDataWithIndexConfig);

	if (documentUnchanged(documentNode, sortedDataWithIndexConfig)) {
		return documentNode;
	}

	// log.debug('document.update: connecting to repoId:%s branch:%s with principals:%s', repoId, 'master', toStr([PRINCIPAL_EXPLORER_WRITE]));
	const collectionRepoWriteConnection = connect({
		branch: 'master',
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId
	});
	return collectionRepoWriteConnection.modify({
		key: documentNodeId,
		editor: () => {
			return sortedDataWithIndexConfig
		}/*,
		node: sortedDataWithIndexConfig as UpdatedNode*/
	});
}
