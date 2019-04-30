import {forceArray} from '/lib/enonic/util/data';


export const map = ({
	_id,
	_name,
	_path,
	displayName,
	words
}) => ({
	displayName,
	id: _id,
	name: _name,
	words: forceArray(words)
});
