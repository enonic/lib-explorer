import {checkAndApplyTypes} from '/lib/explorer/document/checkAndApplyTypes.es';
import {checkOccurrencesAndBuildIndexConfig} from '/lib/explorer/document/checkOccurrencesAndBuildIndexConfig.es';
import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {getFields} from '/lib/explorer/field/getFields';
//import {toStr} from '/lib/util';
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
	__boolRequireValid = true,
	__connection,
	_name, // NOTE if _name is missing, _name becomes same as generated _id

	// Remove from ...rest so it is ignored
	document_metadata, // eslint-disable-line no-unused-vars

	...rest // NOTE can have nested properties, both Array and/or Object
}) {
	/*const user = getUser();
	if (!user) { // CreateNode tries to set owner, and fails when no user
		throw new Error('libAuth.getUser failed, wrap with libContext.run with valid user!');
	}*/

	const nodeToCreate = { _name };

	const fields = getFieldsWithIndexConfigAndValueType();
	const indexConfig = {
		default: 'byType', // TODO Perhaps none?
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};

	let boolValid = true;
	// 1st "pass":
	// * Check if all required fields have values.
	// * Check if any field have too many values.
	// * Skipping type checking, leaving that for 2nd "pass".
	// * Build indexConfig for any field with a value.
	try {
		checkOccurrencesAndBuildIndexConfig({
			fields,
			indexConfig,
			rest
		});
	} catch (e) {
		if (__boolRequireValid) {
			throw e;
		} else {
			boolValid = false;
			log.warning(e.message);
		}
	}
	//log.info(`indexConfig:${toStr(indexConfig)}`);

	// 2nd "pass":
	// Skip checking occurrences, since that was checked in 1st "pass".
	// Check types, since that was skipped in 1st "pass".
	checkAndApplyTypes({
		__boolRequireValid,
		boolValid,
		fields,
		indexConfig,
		nodeToCreate, // modified within function
		rest
	});

	const createdNode = __connection.create(nodeToCreate);
	//log.info(`createdNode:${toStr(createdNode)}`);

	return createdNode;
}
