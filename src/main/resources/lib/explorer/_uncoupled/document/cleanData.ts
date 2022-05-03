import type {AnyObject} from '../../types/index.d'
import type {JavaBridge} from '../../_coupling/types.d';
import type {Field} from '../../types/Field.d';
import type {CleanDataParameters} from './types';

//import {toStr} from '@enonic/js-utils';
//import {toStr} from '@enonic/js-utils/src';
//import {toStr} from '@enonic/js-utils/dist/esm/index.mjs';

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
	} :CleanDataParameters,
	javaBridge :JavaBridge// = javaBridgeDummy
) :AnyObject {
	const {log} = javaBridge;
	//log.debug('cleanData() data:%s', data);
	const cleanedData :AnyObject = JSON.parse(JSON.stringify(data));

	if (cleanedData[FIELD_PATH_GLOBAL]) {
		//log.debug('Cleaning path:%s from data:%s', FIELD_PATH_GLOBAL, cleanedData);
		delete cleanedData[FIELD_PATH_GLOBAL];
	}

	if (cleanedData[FIELD_PATH_META]) {
		//log.debug('Cleaning path:%s from data:%s', FIELD_PATH_META, cleanedData);
		delete cleanedData[FIELD_PATH_META];
	}

	if (cleanExtraFields) {
		traverse(cleanedData).forEach(function(/*value*/) { // Fat arrow destroys this
			if (
				this.notRoot
				&& !this.path[0].startsWith('_')
				&& !this.circular // Why?
			) {
				const pathString = this.path.join('.');
				const field :Omit<Field, 'name'> = fieldsObj[pathString];
				if (!field) {
					//log.debug('Cleaning path:%s from data:%s', pathString, cleanedData);
					this.remove(true);
				}
			}
		}); // traverse
	} // if cleanExtraFields

	//log.debug(`cleanedData:${toStr(cleanedData)}`);
	return cleanedData;
}
