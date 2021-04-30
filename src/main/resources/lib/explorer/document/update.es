import {
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {getFields} from '/lib/explorer/field/getFields';
import {toStr} from '/lib/util';
import {tryApplyValueType} from '/lib/explorer/document/create';


export function update({
	__connection,
	_id,
	...fieldsToUpdate
}) {
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

	const updatedNode = __connection.modify({
		key: _id,
		editor: (existingNode) => {
			//log.info(`existingNode:${toStr(existingNode)}`);
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
					existingNode[field] = tryApplyValueType({
						fieldTypes,
						field,
						value: fieldsToUpdate[field]
					});
				}
			});
			existingNode.modifiedTime = new Date();
			//log.info(`modified existingNode:${toStr(existingNode)}`);
			return existingNode;
		}
	});
	//log.info(`updatedNode:${toStr(updatedNode)}`);
	return updatedNode;
}
