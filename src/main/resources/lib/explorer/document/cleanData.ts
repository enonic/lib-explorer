import {toStr} from '@enonic/js-utils';
import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META
} from '/lib/explorer/constants';
//} from '../constants'; // So that mocha can resolve it?


interface LooseObject {
	[key :string] :any
}

interface CleanDataParameters {
	allowExtraFields? :Boolean,
	data :LooseObject
	//documentType? :LooseObject
}

const DEFAULT_LOG = {
	warning: () => {/**/}
};

export function cleanData(
	{
		allowExtraFields = true,
		data,
		//documentType = {}
	} :CleanDataParameters,
	{
		log = DEFAULT_LOG // Since log is not pure-js it must be passed in
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
