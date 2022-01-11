import type {
	CleanDataParameters,
	Field,
	LooseObject
} from './types';

import {toStr} from '@enonic/js-utils';
//import {toStr} from '@enonic/js-utils/src';
//import {toStr} from '@enonic/js-utils/dist/esm/index.mjs';
import traverse from 'traverse';

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META
//} from '/lib/explorer/constants';
} from '../constants';
import {logDummy} from './dummies';


export function cleanData(
	{
		cleanExtraFields = false,
		data,
		fieldsObj = {}
	} :CleanDataParameters,
	{
		log = logDummy
	} = {}
) :LooseObject {
	const cleanedData :LooseObject = JSON.parse(JSON.stringify(data));

	if (cleanedData[FIELD_PATH_GLOBAL]) {
		log.warning('Cleaning path:%s from data:%s', FIELD_PATH_GLOBAL, cleanedData);
		delete cleanedData[FIELD_PATH_GLOBAL];
	}

	if (cleanedData[FIELD_PATH_META]) {
		log.warning('Cleaning path:%s from data:%s', FIELD_PATH_META, cleanedData);
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
					log.warning('Cleaning path:%s from data:%s', pathString, cleanedData);
					this.remove(true);
				}
			}
		}); // traverse
	} // if cleanExtraFields

	//log.debug(`cleanedData:${toStr(cleanedData)}`);
	return cleanedData;
}
