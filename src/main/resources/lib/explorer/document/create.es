import {checkAndApplyTypes} from '/lib/explorer/document/checkAndApplyTypes';
import {checkOccurrencesAndBuildIndexConfig} from '/lib/explorer/document/checkOccurrencesAndBuildIndexConfig';
import {getFields} from '/lib/explorer/field/getFields';
import {templateToConfig} from '/lib/explorer/indexing/templateToConfig';
import {
	NT_DOCUMENT,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {isObject} from '/lib/explorer/object/isObject';
import {connect} from '/lib/explorer/repo/connect';
import {toStr} from '/lib/util';
import {isNotSet} from '/lib/util/value';
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
	//log.info(`fields:${toStr(fields)}`);
	return fields;
}


export function create({
	_name, // NOTE if _name is missing, _name becomes same as generated _id
	...rest // NOTE can have nested properties, both Array and/or Object
}, {
	boolRequireValid,
	connection,
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

	const inputObject = JSON.parse(JSON.stringify(rest));
	//delete inputObject._indexConfig;

	if (isNotSet(inputObject.document_metadata)) {
		inputObject.document_metadata = {};
	} else if (!isObject(inputObject.document_metadata)) {
		log.error(`document_metadata has to be an Object! Overwriting:${toStr(inputObject.document_metadata)}`);
		inputObject.document_metadata = {};
	}
	inputObject.document_metadata.valid = true; // Temporary value so validation doesn't fail on this field.
	inputObject.document_metadata.createdTime = new Date(); // So validation doesn't fail on this field.

	// Fields starting with underscore are not handeled by checkAndApplyTypes,
	// Because we want full control over them. Same with document_metadata...
	const objToPersist = {
		_name,
		_inheritsPermissions: true,
		_nodeType: NT_DOCUMENT, // Enforce type
		_parentPath: '/', // Enforce flat structure
		//_permissions: []
		type: NT_DOCUMENT // Enforce type (backwards compatibility) // TODO remove in lib-explorer-4.0.0 (app-explorer-2.0.0)
	};

	/*const user = getUser();
	if (!user) { // CreateNode tries to set owner, and fails when no user
		throw new Error('libAuth.getUser failed, wrap with libContext.run with valid user!');
	}*/

	const fields = getFieldsWithIndexConfigAndValueType();

	const languages = [];
	if (language) {
		languages.push(language);
	}
	const indexConfig = {
		default: templateToConfig({
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

	objToPersist._indexConfig = indexConfig;
	objToPersist.document_metadata.valid = boolValid;

	//log.debug(`nodeToCreate:${toStr(nodeToCreate)}`);
	const createdNode = connection.create(objToPersist);
	//log.info(`createdNode:${toStr(createdNode)}`);

	return createdNode;
}
