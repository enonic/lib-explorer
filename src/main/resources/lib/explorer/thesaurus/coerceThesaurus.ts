import type {
	Thesaurus,
	ThesaurusNode
} from '/lib/explorer/types/index.d';


import {forceArray} from '@enonic/js-utils';


export function coerceThesaurus({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	allowedLanguages,
	description = ''
} :ThesaurusNode) :Thesaurus {
	return {
		_id,
		_name,
		_nodeType,
		_path,
		_versionKey,
		allowedLanguages: allowedLanguages ? forceArray(allowedLanguages) : [],
		description
	}
}
