import type {JavaBridge} from '../../_coupling/types.d';
import type {
	DocumentTypeField,
	DocumentTypeFieldsObject
} from '../../types/index.d';
import type {AddExtraFieldsToDocumentTypeParams} from './types';


import {
	VALUE_TYPE_GEO_POINT,
	VALUE_TYPE_SET,
	detectValueType,
	isNonNegativeIntegerString//,
	//isNotSet,
	//toStr
} from '@enonic/js-utils';

//import traverse from 'traverse'; //[!] Error: 'default' is not exported by node_modules/traverse/index.js
//import * as traverse from 'traverse'; //(!) Cannot call a namespace ('traverse')
//import traverse = require('traverse'); // Import assignment cannot be used when targeting ECMAScript modules. Consider using 'import * as ns from "mod"', 'import {a} from "mod"', 'import d from "mod"', or another module format instead.
// module.exports is a function
//const traverse = require('traverse');

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META
} from '../../constants';
import {update as updateDocumentType} from '../documentType/update'
import {
	//addMissingSetToFieldsArray,
	applyDefaultsToField,
	fieldsObjToArray
} from './field';
//import {javaBridgeDummy} from '../dummies';

const traverse = require('traverse');


/* Lets annotate the following data structure, first time, when no documentType
{
	arrayOfObj: [              // Path: ['arrayOfObj']                  1. detectValueType can handle arrays, and thus set arrayOfObj to VALUE_TYPE_SET
		{                      // Path: ['arrayOfObj', '0']				2. should do nothing
			key: [             // Path: ['arrayOfObj', '0', 'key']		3. detectValueType can handle arrays, and thus set arrayOfObj.key to VALUE_TYPE_STRING
				'value1',      // Path: ['arrayOfObj', '0', 'key', '0'] 4. should do nothing
				'value2'       // Path: ['arrayOfObj', '0', 'key', '1'] 5. should do nothing
			]
		}, {                   // Path: ['arrayOfObj', '1']				6. should do nothing
			key: 'singleValue' // Path: ['arrayOfObj', '1', 'key']		7. arrayOfObj.key already VALUE_TYPE_STRING, should do nothing
		}
	]
}

Second time when documentType
{
	arrayOfObj: [              // Path: ['arrayOfObj']					1. arrayOfObj already VALUE_TYPE_SET, should continue to look at children
		{                      // Path: ['arrayOfObj', '0']				2. should do nothing
			key: [             // Path: ['arrayOfObj', '0', 'key']		3. arrayOfObj.key already VALUE_TYPE_STRING, should do nothing
				'value1',      // Path: ['arrayOfObj', '0', 'key', '0']	4. should do nothing
				'value2'       // Path: ['arrayOfObj', '0', 'key', '1']	5. should do nothing
			]
		}, {                   // Path: ['arrayOfObj', '1']				6. should do nothing
			key: 'singleValue' // Path: ['arrayOfObj', '1', 'key']		7. arrayOfObj.key already VALUE_TYPE_STRING, should do nothing
		}
	]
}*/


export function addExtraFieldsToDocumentType(
	{
		data,
		documentTypeId,
		fieldsObj
	} :AddExtraFieldsToDocumentTypeParams,
	javaBridge :JavaBridge// = javaBridgeDummy
) :DocumentTypeFieldsObject {
	//javaBridge.log.debug('document.addExtraFieldsToDocumentType: data:%s', toStr(data));
	//javaBridge.log.debug('document.addExtraFieldsToDocumentType: documentTypeId:%s', documentTypeId);
	//javaBridge.log.debug('document.addExtraFieldsToDocumentType: fieldsObj:%s', toStr(fieldsObj));
	const returnFieldsObj = JSON.parse(JSON.stringify(fieldsObj));
	let boolModified = false;
	traverse(data).forEach(function(value :unknown) { // Fat arrow destroys this
		if (
			this.notRoot
			&& !this.path[0].startsWith('_')
			&& !this.path[0].startsWith(FIELD_PATH_GLOBAL)
			&& !this.path[0].startsWith(FIELD_PATH_META)
			&& !this.circular // Why?
			&& !isNonNegativeIntegerString(this.path[this.path.length - 1]) // Do nothing on array items, just on the array itself.
		) {
			/*if (Array.isArray(value) // Useless value
				&& (
					!value.length
					|| (
						isNotSet(value[0])
						|| value[0] === ''
					)
				)
			) {
				this.block();
			} else { // Value is useful*/

			//javaBridge.log.debug('this.path:%s', toStr(this.path)); When last path item is inside array it's a string of a number
			//const lastPathItem = this.path[this.path.length - 1];
			//javaBridge.log.debug('lastPathItem:%s', lastPathItem);

			const pathStringWithoutArrayIndicies = (this.path as Array<string>).filter(s => !isNonNegativeIntegerString(s)).join('.');
			//javaBridge.log.debug('pathStringWithoutArrayIndicies:%s', pathStringWithoutArrayIndicies);

			const field :Omit<DocumentTypeField, 'name'> = fieldsObj[pathStringWithoutArrayIndicies];
			if (field) {
				const {valueType} = field;
				//javaBridge.log.debug('field:%s valueType:%s', pathStringWithoutArrayIndicies, valueType);
				if (valueType !== VALUE_TYPE_SET) { // Don't look on children unless the valueType is known from before to be set
					this.block();
				}
			} else { // Field has no definition
				//javaBridge.log.debug(`field:${pathString} doesn't exist in documentType, adding...`);
				const detectedType = detectValueType(value); // Even works on arrays, finds common type.
				//javaBridge.log.debug('field:%s detectedType:%s value:%s', pathStringWithoutArrayIndicies, detectedType, toStr(value));

				if (
					detectedType === VALUE_TYPE_GEO_POINT // Don't look on geoPointArray array items
					|| (
						Array.isArray(value) // Don't look on array items
						&& detectedType !== VALUE_TYPE_SET // Unless the valueType is a set
					)
				) {
					this.block();
				}
				returnFieldsObj[pathStringWithoutArrayIndicies] = applyDefaultsToField({
					valueType: detectedType
				}, javaBridge);
				boolModified = true;
			} // if !field

			//} // Useful value
		} // if notRoot...
	}); // traverse
	//javaBridge.log.debug('document.addExtraFieldsToDocumentType: boolModified:%s', boolModified);
	if (boolModified) {
		updateDocumentType({
			_id: documentTypeId,
			properties: fieldsObjToArray(returnFieldsObj, javaBridge)
		}, javaBridge);
	}
	return returnFieldsObj;
}
