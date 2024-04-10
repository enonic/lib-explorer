import type {
	Thesaurus,
	ThesaurusNode
} from '@enonic-types/lib-explorer';


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
