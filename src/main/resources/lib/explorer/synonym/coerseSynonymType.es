import {forceArray} from '@enonic/js-utils';


export function coerseSynonymType({
	_id,
	_nodeType,
	_path,
	_score, // TODO _score -> __score
	_versionKey,
	from,
	//thesaurus,
	thesaurusReference,
	to
}) {
	return {
		_id,
		_nodeType,
		_path,
		_score, // TODO _score -> __score
		_versionKey,
		from: forceArray(from),
		thesaurus: _path.match(/[^/]+/g)[1],
		thesaurusReference,
		to: forceArray(to)
	};
}
