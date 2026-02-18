import type {
	DocumentTypeField,
	DocumentTypeFieldsObject,
} from '../types.d';


import { startsWith } from '@enonic/js-utils/string/startsWith';
// import {toStr} from '@enonic/js-utils/value/toStr';

//import traverse from 'traverse'; //[!] Error: 'default' is not exported by node_modules/traverse/index.js
//import * as traverse from 'traverse'; //(!) Cannot call a namespace ('traverse')

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META
//} from '/lib/explorer/constants';
} from '/lib/explorer/constants';

// @ts-ignore Import assignment cannot be used when targeting ECMAScript modules.
import traverse = require('traverse');


interface CleanDataParameters {
	cleanExtraFields?: boolean;
	data: Record<string, unknown>;
	fieldsObj?: DocumentTypeFieldsObject;
}


export function cleanData(
	{
		cleanExtraFields = false,
		data,
		fieldsObj = {}
	}: CleanDataParameters,
): Record<string, unknown> {
	// log.debug('document.cleanData() data:%s', toStr(data));
	const cleanedData: Record<string, unknown> = JSON.parse(JSON.stringify(data));

	if (cleanedData[FIELD_PATH_GLOBAL]) {
		// log.debug('Cleaning path:%s from data:%s', FIELD_PATH_GLOBAL, cleanedData);
		delete cleanedData[FIELD_PATH_GLOBAL];
	}

	if (cleanedData[FIELD_PATH_META]) {
		// log.debug('Cleaning path:%s from data:%s', FIELD_PATH_META, cleanedData);
		delete cleanedData[FIELD_PATH_META];
	}

	if (cleanExtraFields) {
		// log.debug('document.cleanData() cleanedData:%s', toStr(cleanedData));
		traverse(cleanedData).forEach(function(/*value*/) { // Fat arrow destroys this
			// log.debug('document.cleanData: this.path:%s', toStr(this.path));
			// log.debug('document.cleanData: this.path[0]:%s', toStr(this.path[0]));
			if (
				this.notRoot
				&& !startsWith(this.path[0], '_')
				&& !this.circular // Why?
			) {
				const pathString = this.path.join('.');
				const field :Omit<DocumentTypeField, 'name'> = fieldsObj[pathString];
				if (!field) {
					// log.debug('Cleaning path:%s from data:%s', pathString, cleanedData);
					this.remove(true);
				}
			}
		}); // traverse
	} // if cleanExtraFields

	// log.debug(`cleanedData:${toStr(cleanedData)}`);
	return cleanedData;
}
