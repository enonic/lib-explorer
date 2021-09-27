import {forceArray} from '@enonic/js-utils';


export function coerseSynonymType({
	_id,
	_nodeType,
	_path,
	_score,
	from,
	//thesaurus,
	thesaurusReference,
	to
}) {
	return {
		_id,
		_nodeType,
		_path,
		_score,
		from: forceArray(from),
		thesaurus: _path.match(/[^/]+/g)[1],
		thesaurusReference,
		to: forceArray(to)
	};
}
