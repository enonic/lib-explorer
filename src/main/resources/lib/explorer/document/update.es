//import getIn from 'get-value';
//import setIn from 'set-value';
//import traverse from 'traverse';
import {detailedDiff} from 'deep-object-diff';
import deepEqual from 'fast-deep-equal';
//import HumanDiff from 'human-object-diff';
//const Diff = require('diff');

import {toStr} from '/lib/util';
import {isNotSet} from '/lib/util/value';
import {getFieldsWithIndexConfigAndValueType} from '/lib/explorer/document/create';
import {checkOccurrencesAndBuildIndexConfig} from '/lib/explorer/document/checkOccurrencesAndBuildIndexConfig';
import {checkAndApplyTypes/*, tryApplyValueType*/} from '/lib/explorer/document/checkAndApplyTypes';
import {templateToConfig} from '/lib/explorer/indexing/templateToConfig';
import {isObject} from '/lib/explorer/object/isObject';

/*const { diff: diffDocument } = new HumanDiff({
	objectName: 'document'
});*/


export function update({
	__boolPartial: boolPartial = false,
	__boolRequireValid: boolRequireValid = true,
	__connection: connection,
	_id,
	...rest
}) {
	//log.debug(`__boolPartial:${toStr(__boolPartial)}`);
	//log.debug(`__boolRequireValid:${toStr(__boolRequireValid)}`);
	//log.debug(`_id:${toStr(_id)}`);

	//log.debug(`fieldsToUpdate:${toStr(fieldsToUpdate)}`);

	if(!_id) {
		throw new Error('Missing required parameter _id!');
	}
	const existingNode = connection.get(_id);
	if (!existingNode) {
		throw new Error(`Can't update document with id:${_id} because it does not exist!`);
	}
	//log.info(`existingNode:${toStr(existingNode)}`);

	// Sort by path for diff
	existingNode._indexConfig.configs = existingNode._indexConfig.configs.sort((a,b) => {
		const pathA = a.path;
		const pathB = b.path;
		if (pathA < pathB) {return -1;}
		if (pathA > pathB) {return 1;}
		return 0;// equal
	});
	//log.debug(`existingNode._indexConfig.configs:${toStr(existingNode._indexConfig.configs)}`);

	const fields = getFieldsWithIndexConfigAndValueType();
	//log.info(`fields:${toStr(fields)}`);

	const strigified = JSON.stringify(existingNode);
	const forDiff = JSON.parse(strigified);
	const withType = JSON.parse(strigified);

	// Delete old data if not partial update:
	if (!boolPartial) {
		Object.keys(forDiff).forEach((k) => {
			//log.debug(`k:${k}`);
			if (!k.startsWith('_') && !['document_metadata'].includes(k)) {
				//log.debug(`deleting key:${k} with value:${toStr(forDiff[k])}`);
				delete forDiff[k];
				delete withType[k];
			}
		});
	}
	//log.debug(`forDiff:${toStr(forDiff)}`);
	//log.debug(`withType:${toStr(withType)}`);

	let boolValid = true;

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

	const inputObject = JSON.parse(JSON.stringify(rest));
	//delete inputObject._indexConfig;
	if (isNotSet(inputObject.document_metadata)) {
		inputObject.document_metadata = {};
	} else if (!isObject(inputObject.document_metadata)) {
		log.error(`document_metadata has to be an Object! Overwriting:${toStr(inputObject.document_metadata)}`);
		inputObject.document_metadata = {};
	}
	inputObject.document_metadata.valid = true; // Temporary value so validation doesn't fail on this field.
	inputObject.document_metadata.createdTime = forDiff.document_metadata.createdTime; // So validation doesn't fail on this field.
	//inputObject.document_metadata.modifiedTime = new Date(); // Temporary value to checkOccurrencesAndBuildIndexConfig

	const now = new Date();

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
		boolValid, // passed as value, not possible to modify, return instead?
		fields,
		mode: 'diff',
		inputObject, // only traversed within function
		objToPersist: forDiff // modified within function
	});

	checkAndApplyTypes({
		boolRequireValid,
		boolValid, // passed as value, not possible to modify, return instead?
		fields,
		mode: 'update',
		inputObject, // only traversed within function
		objToPersist: withType // modified within function
	});

	/*traverse(fieldsToUpdate).forEach(function(value) { // Fat arrow destroys this
		if (
			this.isLeaf // This skips arrays... thus Geodata sent as Array
			&& !this.path[0].startsWith('_')
			&& !this.circular
		) {
			if (Array.isArray(this.parent.node)) { // Can be GeoPoint or just normal Array
				if (getIn(fields, [...this.parent.path, 'valueType']) === 'geoPoint') {
					// XP always returns geoPoint string
					// But we allow geoPoint input as array
					// So normalize to string for diff
					setIn(forDiff, this.parent.path, `${getIn(fieldsToUpdate, this.path)[0]},${getIn(fieldsToUpdate, this.path)[1]}`); // Happens twice
				} else { // Just normal arrays
					setIn(forDiff, this.parent.path, getIn(fieldsToUpdate, this.parent.path)); // Happens once per array entry
					if (!getIn(withType, this.parent.path)) {
						setIn(withType, this.parent.path, []);
					}
				}
			}

			try {
				setIn(withType, this.path, tryApplyValueType({
					fields,
					path: this.path,
					value
				}));
			} catch (e) {
				if (__boolRequireValid) {
					throw e;
				} else {
					boolValid = false;
					setIn(withType, this.path, value);
				}
			}
		}
	}); // traverse
	*/
	//log.info(`forDiff:${toStr(forDiff)}`);
	//log.info(`withType:${toStr(withType)}`);

	if (deepEqual(existingNode, forDiff)) {
		log.warning(`No changes detected, not updating document with id:${_id}`);
		return existingNode;
	}
	//log.info(`Changes detected in document with id:${_id}`);

	forDiff.document_metadata.modifiedTime = now;
	withType.document_metadata.modifiedTime = now;

	//log.info(`Changes detected in document with id:${_id} diff:${toStr(Diff.diffJson(existingNode, forDiff))}`);
	log.debug(`Changes detected in document with id:${_id} diff:${toStr(detailedDiff(existingNode, forDiff))}`);
	//log.info(`Changes detected in document with id:${_id} diff:${toStr(diffDocument(existingNode, forDiff))}`);

	const updatedNode = connection.modify({
		key: _id,
		editor: () => {
			return withType;
		}
	});
	//log.info(`updatedNode:${toStr(updatedNode)}`);
	return updatedNode;
}
