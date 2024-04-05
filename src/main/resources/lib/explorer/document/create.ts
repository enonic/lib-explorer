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
	DocumentTypeFields,
	ParentPath,
	Path,
} from '/lib/explorer/types/index.d';
import type {
	CollectionNode,
	DocumentTypeNode
} from '../types/index.d';

import {connect} from '/lib/xp/node';
import {
	forceArray,
	isNotSet as notSet,
	isSet,
	isString,
	isUuidV4String,
	sortKeys,
	toStr
} from '@enonic/js-utils';
import {javaLocaleToSupportedLanguage as stemmingLanguageFromLocale} from '/lib/explorer/stemming/javaLocaleToSupportedLanguage';
import {
	BRANCH_ID_EXPLORER,
	COLLECTION_REPO_PREFIX,
	FIELD_PATH_META,
	NT_DOCUMENT,
	PATH_COLLECTIONS,
	PRINCIPAL_EXPLORER_READ,
	PRINCIPAL_EXPLORER_WRITE,
	REPO_ID_EXPLORER,
	ROOT_PERMISSIONS_EXPLORER
} from '../constants';
import {documentTypeNameToPath} from '../documentType/documentTypeNameToPath';
//import {javaBridgeDummy} from '../dummies';
import {addExtraFieldsToDocumentType} from './addExtraFieldsToDocumentType';
import {buildIndexConfig} from './buildIndexConfig';
import {cleanData} from './cleanData';
import {constrainPropertyNames} from './constrainPropertyNames';
import {fieldsArrayToObj} from './field';
import {validate} from './validate';
import {typeCastToJava} from './typeCastToJava';


export interface CreateParameterObject {
	addExtraFields?: boolean
	cleanExtraFields?: boolean
	collectionId?: string // TODO Scalar Regexp?
	collectionName?: string
	collectorId: string // TODO Scalar Regexp?
	collectorVersion: string // TODO Scalar Regexp?
	data?: {
		_name?: string
		_parentPath?: ParentPath
		_path?: Path
		[key: PropertyKey]: unknown
	}
	documentTypeId?: string // TODO Scalar Regexp?
	documentTypeName?: string
	fields?: DocumentTypeFields
	language?: string
	requireValid?: boolean
	//repoName?: string
	stemmingLanguage?: string
	validateOccurrences?: boolean
	validateTypes?: boolean
}


// dieOnError
export function create(
	createParameterObject: CreateParameterObject,
) {
	if (notSet(createParameterObject)) {
		throw new Error('create: parameter object is missing!');
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
		addExtraFields = !cleanExtraFields,
		requireValid = false,
		validateOccurrences = false,
		validateTypes = requireValid
	} = createParameterObject;
	let {
		// Inputs
		collectionName, // If empty gotten from collectionNode via collectionId
		documentTypeId, // If empty gotten from documentTypeName or fallback to collectionNode via collectionId
		documentTypeName, // Is now a required parameter for collectors, but not the document API.
		fields, // If empty gotten from documentTypeNode
		language, // If empty gotten from collectionNode (or fallback to english)
		stemmingLanguage, // If empty gotten from language
	} = createParameterObject;

	// log.debug('document.create: collectionId:%s', collectionId);
	// log.debug('document.create: collectionName:%s', collectionName);
	// log.debug('document.create: collectorId:%s', collectorId);
	// log.debug('document.create: collectorVersion:%s', collectorVersion);
	// log.debug('document.create: data:%s', toStr(data));
	// log.debug('document.create: documentTypeId:%s', documentTypeId);
	// log.debug('document.create: documentTypeName:%s', documentTypeName);
	// log.debug('document.create: fields:%s', toStr(fields));
	// log.debug('document.create: language:%s', language);
	// log.debug('document.create: stemmingLanguage:%s', stemmingLanguage);

	// log.debug('document.create: addExtraFields:%s', addExtraFields);
	// log.debug('document.create: cleanExtraFields:%s', cleanExtraFields);
	// log.debug('document.create: requireValid:%s', requireValid);
	// log.debug('document.create: validateOccurrences:%s', validateOccurrences);
	// log.debug('document.create: validateTypes:%s', validateTypes);

	//──────────────────────────────────────────────────────────────────────────
	// Checking required parameters
	//──────────────────────────────────────────────────────────────────────────
	if ( // Need to know which documentTypeNode to expand.
		addExtraFields
		&& notSet(collectionId)
		&& notSet(collectionName)
		&& notSet(documentTypeName)
		&& notSet(documentTypeId)
	) {
		throw new Error("create: when addExtraFields=true either (documentTypeName or documentTypeId) must be provided or (collectionName or collectionId and the collectionNode must contain a default documentTypeId)!");
	}

	if ( // Need to know what to clean or validate on.
		(
			validateTypes
			|| validateOccurrences
			|| cleanExtraFields
			//|| requireValid
		)
		&& notSet(collectionId)
		&& notSet(collectionName)
		&& notSet(documentTypeName)
		&& notSet(documentTypeId)
		&& notSet(fields)
	) {
		throw new Error('create: when at least one of validateTypes, validateOccurrences or cleanExtraFields is true, either documentTypeName, documentTypeId or fields must be provided or (collectionName or collectionId and the collectionNode must contain a default documentTypeId)!');
	}

	if (requireValid && !(validateTypes || validateOccurrences)) {
		throw new Error("create: when requireValid=true either validateTypes or validateOccurrences must be true!");
	}


	if ( // Need to know which repo to write to.
		notSet(collectionName) &&
		notSet(collectionId)
	) {
		throw new Error("create: either provide collectionName or collectionId!");
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
	// Get derived "parameters" from provided parameters
	//──────────────────────────────────────────────────────────────────────────
	// At this point the required parameters are provided and of the correct
	// type. From the provided parameters we now get derived parameters.
	//
	// if documentTypeId is provided it supersedes documentTypeName (and default documentTypeId from collectionNode)
	// if documentTypeName is provided it supersedes 'Default document type' aka collectionNode.documentTypeId

	if (
		documentTypeId || notSet(documentTypeName) ||
		collectionId || notSet(collectionName) ||
		notSet(fields) ||
		notSet(language)
	) {
		log.debug('document.create: connecting to repoId:%s branch:%s with principals:%s', REPO_ID_EXPLORER, BRANCH_ID_EXPLORER, toStr([PRINCIPAL_EXPLORER_READ]));
		const explorerReadConnection = connect({
			branch: BRANCH_ID_EXPLORER,
			principals: [PRINCIPAL_EXPLORER_READ],
			repoId: REPO_ID_EXPLORER
		});
		log.debug('document.create: connected to repoId:%s branch:%s with principals:%s', REPO_ID_EXPLORER, BRANCH_ID_EXPLORER, toStr([PRINCIPAL_EXPLORER_READ]));

		// There are many valid ways to call document.create with regards to documentTypeId and documentTypeName.
		// 1. Only documentTypeId provided.
		// 2. Only documentTypeName provided (typical for collectors).
		// 3. Both documentTypeId and documentTypeName provided.
		// 4. Neither documentTypeId nor documentTypeName provided, but collectionName or collectionId provided and default documentTypeId in collectionNode
		// 5. Neither documentTypeId nor documentTypeName provided (only valid when addExtraFields is false and validation is off, or fields provided).
		//
		// documentTypeName is always required, since it's stored on the node for aggregation purposes.
		// documentTypeId is only? required when addExtraFields is true

		let documentTypeNode: DocumentTypeNode;
		if (documentTypeId) { // This covers 1 and 3.
			documentTypeNode = explorerReadConnection.get(documentTypeId);
			// log.debug("document.create: documentTypeNode(A):%s", toStr(documentTypeNode));
			if (documentTypeName && documentTypeName !== documentTypeNode._name) {
				log.warning('documentTypeNode._name:%s from documentTypeId:%s supersedes passed in documentTypeName:%s', documentTypeNode._name, documentTypeId, documentTypeName);
			}
			documentTypeName = documentTypeNode._name;
			log.debug('document.create: sat documentTypeName:%s from documentTypeId:%s', documentTypeName, documentTypeId);
		} else if(
			// !documentTypeId &&
			documentTypeName
		) {
			const documentTypeNodePath = documentTypeNameToPath(documentTypeName);
			documentTypeNode = explorerReadConnection.get(documentTypeNodePath);
			// log.debug("document.create: documentTypeNode(B):%s", toStr(documentTypeNode));
			if (!documentTypeNode) {
				throw new Error(`Something went wrong when trying to get documentTypeId from documentTypeName:${documentTypeName} via path:${documentTypeNodePath}`);
			}
			documentTypeId = documentTypeNode._id; // NOTE: documentTypeId is needed when adding extra fields
			log.debug('document.create: sat documentTypeId:%s from documentTypeName:%s', documentTypeId, documentTypeName);
		}
		// At this point:
		//  * either both documentTypeId and documentTypeName are undefined (so try default documentTypeId from collectionNode)
		//  * or both documentTypeId and documentTypeName are defined.

		let collectionNode: CollectionNode;
		if (collectionId) {
			collectionNode = explorerReadConnection.get(collectionId) as CollectionNode;
			log.debug('collectionNode:%s', collectionNode);
			if (collectionName && collectionName !== collectionNode._name) {
				log.warning('collectionNode._name:%s from collectionId:%s supersedes passed in collectionName:%s', collectionNode._name, collectionId, collectionName);
			}
			collectionName = collectionNode._name;
			log.debug('document.create: sat collectionName:%s from collectionId:%s', collectionName, collectionId);
		}

		if (!collectionName) {
			throw new Error(`collectionName is required to create nodes (and also for aggregation on collectionName)!`);
		}

		// When do we need to read from the collectionNode?
		//  * When !language
		//  * When addExtraFields === true && !documentTypeName // fields it not good enough when addExtraFields === true
		//  * When addExtraFields === false && !(documentTypeName || fields)
		if (
			notSet(language)
			|| (addExtraFields && notSet(documentTypeName))
			|| (
				!addExtraFields && !(
					isSet(documentTypeName) || isSet(fields)
				)
			)
		) {
			if (notSet(collectionNode)) {
				if (notSet(collectionName)) {
					throw new Error('!collectionName && !collectionId: This should never happen!');
				}
				const collectionPath = `${PATH_COLLECTIONS}/${collectionName}`;
				log.debug('collectionPath:%s', collectionPath);
				collectionNode = explorerReadConnection.get(collectionPath);
				log.debug('collectionNode:%s', collectionNode);
			}

			if(notSet(language)) {
				const languageFromCollection = collectionNode['language']; // This can be undefined
				if (languageFromCollection) {
					language = languageFromCollection;
					log.debug('document.create: sat language:%s from collectionNode.language', language);
				}
				// NOTE: When no language is provided anywhere, there should be no stemming.
			}

			// When do I need to read default documentTypeId from collectionNode?
			//  * When addExtraFields === true && !documentTypeName
			//  * When addExtraFields === false && !(documentTypeName || fields)
			if (
				(addExtraFields && notSet(documentTypeName))
				||
				(!addExtraFields && !(isSet(documentTypeName) || isSet(fields)))
			) {
				if (addExtraFields && notSet(documentTypeName)) {
					if (!collectionNode['documentTypeId']) {
						throw new Error(`addExtraFields is true, but documentTypeName nor documentTypeId provided and no default documentTypeId in collectionNode!`);
					}
				}

				if (notSet(documentTypeName)) {
					// Get documentTypeName from default documentTypeId

					documentTypeId = collectionNode['documentTypeId'].toString(); // NOTE: documentTypeId is needed when adding extra fields
					log.debug('document.create: sat documentTypeId:%s from collectionNode.documentTypeId', documentTypeId);

					documentTypeNode = explorerReadConnection.get(documentTypeId);
					if (!documentTypeNode) {
						throw new Error(`Unable to get documentTypeNode with id:${documentTypeId}`);
					}
					documentTypeName = documentTypeNode._name;
					log.debug('document.create: sat documentTypeName:%s from collectionNode.documentTypeId._name', documentTypeName);
				}
			} // if need to read default documentTypeId from collectionNode
		} // if need to read from collectionNode

		if (notSet(fields)) {
			// log.debug("document.create: documentTypeNode:%s", toStr(documentTypeNode));
			// log.debug("document.create: documentTypeNode['properties']:%s", toStr(documentTypeNode['properties'])); // undefined
			fields = isSet(documentTypeNode['properties']) ? forceArray(documentTypeNode['properties']) : [];
			log.debug('document.create: sat fields:%s from documentTypeNode.properties', toStr(fields));
		}
	}

	//──────────────────────────────────────────────────────────────────────────

	if(notSet(stemmingLanguage) && isSet(language)) {
		stemmingLanguage = stemmingLanguageFromLocale(language);
		log.debug('document.create: sat stemmingLanguage:%s from language:%s', stemmingLanguage, language);
	}

	//──────────────────────────────────────────────────────────────────────────

	// log.debug('document.create: collectionId:%s', collectionId);
	// log.debug('document.create: collectorId:%s', collectorId);
	// log.debug('document.create: collectorVersion:%s', collectorVersion);
	// log.debug('document.create: data:%s', toStr(data));
	// log.debug('document.create: fields:%s', toStr(fields));

	//let myFields = JSON.parse(JSON.stringify(fields));
	let fieldsObj = fieldsArrayToObj(fields);
	// log.debug('document.create: fieldsObj:%s', toStr(fieldsObj));

	const dataWithConstrainedPropertyNames = constrainPropertyNames({
		data
	});
	// log.debug('document.create: dataWithConstrainedPropertyNames:%s', toStr(dataWithConstrainedPropertyNames));

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

	const isValid = validate({
		data: cleanedData,
		fieldsObj,
		validateOccurrences,
		validateTypes
	});
	// log.debug(`isValid:${toStr(isValid)}`);
	if (requireValid && !isValid) {
		throw new Error(`validation failed! requireValid:${requireValid} validateOccurrences:${validateOccurrences} validateTypes:${validateTypes} cleanedData:${toStr(cleanedData)} fieldsObj:${toStr(fieldsObj)}`);
	}

	const dataWithJavaTypes = typeCastToJava({
		data: cleanedData,
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
	dataWithJavaTypes._inheritsPermissions = false; // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
	dataWithJavaTypes._permissions = ROOT_PERMISSIONS_EXPLORER;

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
	dataWithJavaTypes._nodeType = NT_DOCUMENT;

	const sortedDataWithIndexConfig = sortKeys(dataWithJavaTypes);
	// log.debug('sortedDataWithIndexConfig %s', sortedDataWithIndexConfig);

	const repoId = `${COLLECTION_REPO_PREFIX}${collectionName}`;
	// log.debug('repoId:%s', repoId);

	// log.debug('document.create: connecting to repoId:%s branch:%s with principals:%s', repoId, 'master', toStr([PRINCIPAL_EXPLORER_WRITE]));
	const collectionRepoWriteConnection = connect({
		branch: 'master',
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId
	});

	// log.debug('creating node:%s', sortedDataWithIndexConfig);
	return collectionRepoWriteConnection.create(sortedDataWithIndexConfig);
}
