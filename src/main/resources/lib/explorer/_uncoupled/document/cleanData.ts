import type {AnyObject} from '../../types/index.d'
import type {JavaBridge} from '../../_coupling/types.d';
import type {DocumentTypeField} from '../../types/index.d';
import type {CleanDataParameters} from './types';


// import {toStr} from '@enonic/js-utils/value/toStr';

//import traverse from 'traverse'; //[!] Error: 'default' is not exported by node_modules/traverse/index.js
//import * as traverse from 'traverse'; //(!) Cannot call a namespace ('traverse')

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META
//} from '/lib/explorer/constants';
} from '../../constants';
//import {javaBridgeDummy} from '../dummies';

const traverse = require('traverse');


export function cleanData(
	{
		cleanExtraFields = false,
		data,
		fieldsObj = {}
	}: CleanDataParameters,
	javaBridge: JavaBridge// = javaBridgeDummy
): AnyObject {
	// javaBridge.log.debug('document.cleanData() data:%s', toStr(data));
	const cleanedData :AnyObject = JSON.parse(JSON.stringify(data));

	if (cleanedData[FIELD_PATH_GLOBAL]) {
		// javaBridge.log.debug('Cleaning path:%s from data:%s', FIELD_PATH_GLOBAL, cleanedData);
		delete cleanedData[FIELD_PATH_GLOBAL];
	}

	if (cleanedData[FIELD_PATH_META]) {
		// javaBridge.log.debug('Cleaning path:%s from data:%s', FIELD_PATH_META, cleanedData);
		delete cleanedData[FIELD_PATH_META];
	}

	if (cleanExtraFields) {
		// javaBridge.log.debug('document.cleanData() cleanedData:%s', toStr(cleanedData));
		traverse(cleanedData).forEach(function(/*value*/) { // Fat arrow destroys this
			// javaBridge.log.debug('document.cleanData: this.path:%s', toStr(this.path));
			// javaBridge.log.debug('document.cleanData: this.path[0]:%s', toStr(this.path[0]));
			if (
				this.notRoot
				&& !this.path[0].startsWith('_')
				&& !this.circular // Why?
			) {
				const pathString = this.path.join('.');
				const field :Omit<DocumentTypeField, 'name'> = fieldsObj[pathString];
				if (!field) {
					// javaBridge.log.debug('Cleaning path:%s from data:%s', pathString, cleanedData);
					this.remove(true);
				}
			}
		}); // traverse
	} // if cleanExtraFields

	// javaBridge.log.debug(`cleanedData:${toStr(cleanedData)}`);
	return cleanedData;
}
