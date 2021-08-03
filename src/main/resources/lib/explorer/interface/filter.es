import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';


export const filter = ({
	_id,
	_name,
	_path,
	displayName,
	collections,
	fields,// TODO = DEFAULT_INTERFACE_FIELDS,
	stopWords,
	synonyms
} = {}) => ({
	_id,
	_name,
	_path,
	displayName,
	collections: forceArray(collections),
	fields: forceArray(fields),
	stopWords: forceArray(stopWords),
	synonyms: forceArray(synonyms)
});
