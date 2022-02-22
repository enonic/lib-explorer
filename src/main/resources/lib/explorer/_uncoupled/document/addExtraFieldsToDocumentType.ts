import type {JavaBridge} from '../../_coupling/types.d';
import type {
	Field,
	FieldsObject
} from '../../documentType/types.d';
import type {AddExtraFieldsToDocumentTypeParams} from './types';


import {
	VALUE_TYPE_GEO_POINT,
	detectValueType,
	toStr
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


export function addExtraFieldsToDocumentType(
	{
		data,
		documentTypeId,
		fieldsObj
	} :AddExtraFieldsToDocumentTypeParams,
	javaBridge :JavaBridge// = javaBridgeDummy
) :FieldsObject {
	//const {log} = javaBridge;
	//log.debug('document.addExtraFieldsToDocumentType: data:%s', toStr(data));
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
		) {
			const pathString = this.path.join('.');
			//log.debug(`pathString:${pathString}`);

			const field :Omit<Field, 'name'> = fieldsObj[pathString];
			if (!field) { // Field has no definition
				//log.debug(`field:${pathString} doesn't exist in documentType, adding...`);
				const detectedType = detectValueType(value);
				//javaBridge.log.debug('field:%s detectedType:%s', pathString, detectedType);
				if (detectedType === VALUE_TYPE_GEO_POINT) {
					this.block();
				}
				returnFieldsObj[pathString] = applyDefaultsToField({
					valueType: detectedType
				}, javaBridge);
				boolModified = true;
				if (Array.isArray(value)) {
					this.block();
				}
			} // if !field
		}
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
