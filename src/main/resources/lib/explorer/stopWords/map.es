import {forceArray} from '@enonic/js-utils';


export const map = ({
	_id,
	_name,
	//_nodeType,
	_path,
	//_versionKey,
	displayName,
	type,
	words
}) => ({
	displayName,
	id: _id,
	name: _name,
	//_nodeType,
	_path,
	//_versionKey,
	type,
	words: words ? forceArray(words) : [] // No words allowed?
});
