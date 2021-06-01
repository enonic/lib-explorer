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
		})
	});
	//log.info(`fieldRes:${toStr(fieldRes)}`);
	const fields = {};
	fieldRes.hits.forEach(({
		//_name,
		fieldType,
		indexConfig,
		key,
		min,
		max
	}) => {
		if (key !== '_allText') {
			fields[key] = {
				indexConfig,
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
	__boolRequireValid: boolRequireValid = true,
	__connection: connection,
	_name, // NOTE if _name is missing, _name becomes same as generated _id
	...rest // NOTE can have nested properties, both Array and/or Object
}) {
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

	const objToPersist = { // Fields starting with underscore are not handeled by checkAndApplyTypes
		_name,
		_inheritsPermissions: true,
		_nodeType: NT_DOCUMENT, // Enforce type
		_parentPath: '/' // Enforce flat structure
		//_permissions: []
	};

	/*const user = getUser();
	if (!user) { // CreateNode tries to set owner, and fails when no user
		throw new Error('libAuth.getUser failed, wrap with libContext.run with valid user!');
	}*/

	const fields = getFieldsWithIndexConfigAndValueType();

	const indexConfig = {
		default: templateToConfig({
			template: 'byType', // TODO Perhaps minimal?
			indexValueProcessors: [],
			languages: []
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

	let boolValid = true;
	// 1st "pass":
	// * Check if all required fields have values.
	// * Check if any field have too many values.
	// * Skipping type checking, leaving that for 2nd "pass".
	// * Build indexConfig for any field with a value.
	try {
		checkOccurrencesAndBuildIndexConfig({
			boolRequireValid,
			fields,
			indexConfig, // modified within function
			inputObject // only read from within function
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

	// 2nd "pass":
	// Skip checking occurrences, since that was checked in 1st "pass".
	// Check types, since that was skipped in 1st "pass".
	checkAndApplyTypes({
		boolRequireValid,
		boolValid,
		fields,
		inputObject, // only traversed within function
		mode: 'create',
		objToPersist // modified within function
	});

	objToPersist._indexConfig = indexConfig;

	//log.debug(`nodeToCreate:${toStr(nodeToCreate)}`);
	const createdNode = connection.create(objToPersist);
	//log.info(`createdNode:${toStr(createdNode)}`);

	return createdNode;
}
