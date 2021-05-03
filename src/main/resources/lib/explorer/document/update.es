import {detailedDiff} from 'deep-object-diff';
import deepEqual from 'fast-deep-equal';
//import HumanDiff from 'human-object-diff';
//const Diff = require('diff');

import {
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {getFields} from '/lib/explorer/field/getFields';
import {toStr} from '/lib/util';
import {tryApplyValueType} from '/lib/explorer/document/create';

/*const { diff: diffDocument } = new HumanDiff({
	objectName: 'document'
});*/


export function update({
	__boolRequireValid = true,
	__connection,
	_id,
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

	// Get all field defititions
	const fieldRes = getFields({
		connection: connect({
			principals: [PRINCIPAL_EXPLORER_READ]
		})
	});
	//log.info(`fieldRes:${toStr(fieldRes)}`);
	const fieldTypes = {};
	fieldRes.hits.forEach(({_name, fieldType}) => {
		fieldTypes[_name] = fieldType;
	});
	//log.info(`fieldTypes:${toStr(fieldTypes)}`);

	const strigified = JSON.stringify(existingNode);
	const forDiff = JSON.parse(strigified);
	const withType = JSON.parse(strigified);
	//log.info(`dereffedNode:${toStr(dereffedNode)}`);
	Object.keys(fieldsToUpdate).forEach((field) => {
		if (
			field.startsWith('_')
			|| [
				'createdTime',
				'creator',
				'modifiedTime',
				'type'
			].includes(field)
		) { // Not allowed to modify any underscore fields
			log.warning(`Not updating field:${field} to:${toStr(fieldsToUpdate[field])}`);
		} else {
			if (fieldTypes[field] === 'geoPoint' && Array.isArray(fieldsToUpdate[field])) {
				// XP always returns geoPoint string
				// But we allow geoPoint input as array
				// So normalize to string for diff
				forDiff[field] = `${fieldsToUpdate[field][0]},${fieldsToUpdate[field][1]}`;
			} else {
				forDiff[field] = fieldsToUpdate[field];
			}
			try {
				withType[field] = tryApplyValueType({ // Twice because this destroys diff
					fieldTypes,
					field,
					value: fieldsToUpdate[field]
				});
			} catch (e) {
				if (__boolRequireValid) {
					throw e;
				} else {
					withType[field] = fieldsToUpdate[field];
				}
			}
		}
	});
	//log.info(`dereffedNode:${toStr(dereffedNode)}`);

	if (deepEqual(existingNode, forDiff)) {
		log.warning(`No changes detected, not updating document with id:${_id}`);
		return existingNode;
	}
	//log.info(`Changes detected in document with id:${_id}`);

	forDiff.modifiedTime = new Date();
	//log.info(`Changes detected in document with id:${_id} diff:${toStr(Diff.diffJson(existingNode, forDiff))}`);
	log.debug(`Changes detected in document with id:${_id} diff:${toStr(detailedDiff(existingNode, forDiff))}`);
	//log.info(`Changes detected in document with id:${_id} diff:${toStr(diffDocument(existingNode, forDiff))}`);

	withType.modifiedTime = forDiff.modifiedTime;
	const updatedNode = __connection.modify({
		key: _id,
		editor: () => {
			return withType;
		}
	});
	//log.info(`updatedNode:${toStr(updatedNode)}`);
	return updatedNode;
}
