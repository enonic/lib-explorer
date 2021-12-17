//import {toStr} from '@enonic/js-utils';
import {toStr} from '@enonic/js-utils/dist/esm/index.mjs';

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META
//} from '/lib/explorer/constants';
} from '../constants';
import {logDummy} from './dummies';


interface LooseObject {
	[key :string] :unknown
}

interface CleanDataParameters {
	allowExtraFields? :boolean,
	data :LooseObject
	//documentType? :LooseObject
}


export function cleanData(
	{
		allowExtraFields = true,
		data//,
		//documentType = {}
	} :CleanDataParameters,
	{
		log = logDummy
	} = {}
) :LooseObject {
	const cleanedData :LooseObject = JSON.parse(JSON.stringify(data));

	if (!allowExtraFields) {
		// TODO: Clean fields outside DocumentType
		//documentType
	}
	if (cleanedData[FIELD_PATH_GLOBAL]) {
		log.warning(`Cleaning ${FIELD_PATH_GLOBAL} from ${toStr(cleanedData)}`);
		delete cleanedData[FIELD_PATH_GLOBAL];
	}
	if (cleanedData[FIELD_PATH_META]) {
		log.warning(`Cleaning ${FIELD_PATH_META} from ${toStr(cleanedData)}`);
		delete cleanedData[FIELD_PATH_META];
	}
	return cleanedData;
}
