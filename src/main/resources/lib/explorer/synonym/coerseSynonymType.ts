import type {
	OneOrMore,
	QueriedSynonym
} from '/lib/explorer/types/index.d';

import {forceArray} from '@enonic/js-utils';


export function coerseSynonymType({
	_id,
	_name,
	_nodeType,
	_path,
	_score, // TODO _score -> __score
	_versionKey,
	from,
	//thesaurus,
	thesaurusReference,
	to
} :Omit<QueriedSynonym,'_score'|'from'|'thesaurus'|'to'> & {
	_score ?:number
	from :OneOrMore<string>
	thesaurus ?:string
	to :OneOrMore<string>
}) {
	return {
		_id,
		_name,
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
