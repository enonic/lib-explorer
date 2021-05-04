import getIn from 'get-value';
import setIn from 'set-value';
import traverse from 'traverse';
import {detailedDiff} from 'deep-object-diff';
import deepEqual from 'fast-deep-equal';
//import HumanDiff from 'human-object-diff';
//const Diff = require('diff');

import {toStr} from '/lib/util';
import {
	getFieldsWithIndexConfigAndValueType,
	tryApplyValueType
} from '/lib/explorer/document/create';

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
	traverse(fieldsToUpdate).forEach(function(value) { // Fat arrow destroys this
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
	log.info(`forDiff:${toStr(forDiff)}`);
	log.info(`withType:${toStr(withType)}`);

	if (deepEqual(existingNode, forDiff)) {
		log.warning(`No changes detected, not updating document with id:${_id}`);
		return existingNode;
	}
	//log.info(`Changes detected in document with id:${_id}`);

	if (!forDiff.document_metadata) {
		forDiff.document_metadata = {};
	}
	forDiff.document_metadata.modifiedTime = new Date();
	forDiff.document_metadata.valid = boolValid;
	//log.info(`Changes detected in document with id:${_id} diff:${toStr(Diff.diffJson(existingNode, forDiff))}`);
	log.debug(`Changes detected in document with id:${_id} diff:${toStr(detailedDiff(existingNode, forDiff))}`);
	//log.info(`Changes detected in document with id:${_id} diff:${toStr(diffDocument(existingNode, forDiff))}`);

	if (!withType.document_metadata) {
		withType.document_metadata = {};
	}
	withType.document_metadata.modifiedTime = forDiff.document_metadata.modifiedTime;
	withType.document_metadata.valid = boolValid;
	const updatedNode = __connection.modify({
		key: _id,
		editor: () => {
			return withType;
		}
	});
	//log.info(`updatedNode:${toStr(updatedNode)}`);
	return updatedNode;
}
