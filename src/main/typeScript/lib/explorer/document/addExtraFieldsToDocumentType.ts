import type {
	AddExtraFieldsToDocumentTypeParams,
	Field,
	FieldsObject,
	JavaBridge
} from './types';

import {
	VALUE_TYPE_GEO_POINT,
	detectValueType//,
	//toStr
} from '@enonic/js-utils';
import traverse from 'traverse';

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META
} from '../constants';
import {
	//addMissingSetToFieldsArray,
	applyDefaultsToField,
} from './field';
import {javaBridgeDummy} from './dummies';



export function addExtraFieldsToDocumentType(
	{
		data,
		fieldsObj,
		updateDocumentType = () => {}
	} :AddExtraFieldsToDocumentTypeParams,
	javaBridge :JavaBridge = javaBridgeDummy
) :FieldsObject {
	//const {log} = javaBridge;
	//log.debug(`data:${toStr(data)}`);
	const returnFieldsObj = JSON.parse(JSON.stringify(fieldsObj));
	let boolModified = false;
	traverse(data).forEach(function(value) { // Fat arrow destroys this
		if (
			this.notRoot
			&& !this.path[0].startsWith('_')
			&& !this.path[0].startsWith(FIELD_PATH_GLOBAL)
			&& !this.path[0].startsWith(FIELD_PATH_META)
			&& !this.circular // Why?
		) {
			const pathString = this.path.join('.');
			//log.debug(`pathString:${pathString}`);

			const field :Omit<Field, 'name'> = fieldsObj[pathString];
			if (!field) { // Field has no definition
				//log.debug(`field:${pathString} doesn't exist in documentType, adding...`);
				const detectedType = detectValueType(value);
				//log.debug(`field:${pathString} detectedType:${detectedType}`);
				if (detectedType === VALUE_TYPE_GEO_POINT) {
					this.block();
				}
				returnFieldsObj[pathString] = applyDefaultsToField({
					valueType: detectedType
				}, javaBridge);
				boolModified = true;
			} // if !field
		}
	}); // traverse
	if (boolModified) {
		updateDocumentType(returnFieldsObj);
	}
	return returnFieldsObj;
}
