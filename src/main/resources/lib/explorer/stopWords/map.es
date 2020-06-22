import {forceArray} from '/lib/util/data';


export const map = ({
	_id,
	_name,
	_path,
	displayName,
	type,
	words
}) => ({
	displayName,
	id: _id,
	name: _name,
	_path,
	type,
	words: words ? forceArray(words) : [] // No words allowed?
});
