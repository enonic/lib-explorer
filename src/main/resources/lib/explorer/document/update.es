import getIn from 'get-value';
import setIn from 'set-value';
import traverse from 'traverse';
import {detailedDiff} from 'deep-object-diff';
import deepEqual from 'fast-deep-equal';
//import HumanDiff from 'human-object-diff';
//const Diff = require('diff');

import {toStr} from '/lib/util';
import {getFieldsWithIndexConfigAndValueType} from '/lib/explorer/document/create';
import {checkOccurrencesAndBuildIndexConfig} from '/lib/explorer/document/checkOccurrencesAndBuildIndexConfig.es';
import {checkAndApplyTypes, tryApplyValueType} from '/lib/explorer/document/checkAndApplyTypes.es';

/*const { diff: diffDocument } = new HumanDiff({
	objectName: 'document'
});*/


export function update({
	__boolRequireValid = true,
	__connection,
	_id,

	// Remove from ...fieldsToUpdate so it is ignored
	document_metadata, // eslint-disable-line no-unused-vars

	...fieldsToUpdate
}) {
	if(!_id) {
		throw new Error('Missing required parameter _id!');
	}
	//log.info(`_id:${toStr(_id)}`);
	//log.info(`fieldsToUpdate:${toStr(fieldsToUpdate)}`);
	const existingNode = __connection.get(_id);
	if (!existingNode) {
		throw new Error(`Can't update document with id:${_id} because it does not exist!`);
	}
	//log.info(`existingNode:${toStr(existingNode)}`);

	const fields = getFieldsWithIndexConfigAndValueType();
	//log.info(`fields:${toStr(fields)}`);

	const strigified = JSON.stringify(existingNode);
	const forDiff = JSON.parse(strigified);
	const withType = JSON.parse(strigified);

	let boolValid = true;
	const indexConfig = {
		default: 'byType', // TODO Perhaps none?
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	// 1st "pass":
	// * Check if all required fields have values.
	// * Check if any field have too many values.
	// * Skipping type checking, leaving that for 2nd "pass".
	// * Build indexConfig for any field with a value.
	try {
		checkOccurrencesAndBuildIndexConfig({
			fields,
			indexConfig,
			rest: fieldsToUpdate
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

	const now = new Date();

	// 2nd "pass":
	// Skip checking occurrences, since that was checked in 1st "pass".
	// Check types, since that was skipped in 1st "pass".
	checkAndApplyTypes({
		__boolRequireValid,
		__mode: 'diff',
		__now: now,
		boolValid, // passed as value, not possible to modify, return instead?
		fields,
		indexConfig,
		nodeToCreate: forDiff, // modified within function
		rest: fieldsToUpdate
	});

	checkAndApplyTypes({
		__boolRequireValid,
		__mode: 'updates',
		__now: now,
		boolValid, // passed as value, not possible to modify, return instead?
		fields,
		indexConfig,
		nodeToCreate: withType, // modified within function
		rest: fieldsToUpdate
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
	log.info(`forDiff:${toStr(forDiff)}`);
	log.info(`withType:${toStr(withType)}`);

	if (deepEqual(existingNode, forDiff)) {
		log.warning(`No changes detected, not updating document with id:${_id}`);
		return existingNode;
	}
	//log.info(`Changes detected in document with id:${_id}`);

	forDiff.document_metadata.modifiedTime = now;
	//log.info(`Changes detected in document with id:${_id} diff:${toStr(Diff.diffJson(existingNode, forDiff))}`);
	log.debug(`Changes detected in document with id:${_id} diff:${toStr(detailedDiff(existingNode, forDiff))}`);
	//log.info(`Changes detected in document with id:${_id} diff:${toStr(diffDocument(existingNode, forDiff))}`);

	const updatedNode = __connection.modify({
		key: _id,
		editor: () => {
			return withType;
		}
	});
	//log.info(`updatedNode:${toStr(updatedNode)}`);
	return updatedNode;
}
