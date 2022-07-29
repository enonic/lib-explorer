import type {
	Synonym,
	SynonymNode
} from '/lib/explorer/types/index.d';


import {forceArray} from '@enonic/js-utils';
import {languagesObjectToArray} from '/lib/explorer/synonym/languagesObjectToArray';


export function moldSynonymNode({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	comment = '',
	enabled = true,
	disabledInInterfaces = [],
	languages: languagesObject = {},
	thesaurusReference
} :SynonymNode) :Synonym {
	return {
		_id,
		_name,
		_nodeType,
		_path,
		_versionKey,
		comment,
		enabled,
		disabledInInterfaces: disabledInInterfaces ? forceArray(disabledInInterfaces) : [],
		languages: languagesObjectToArray({
			languagesObject
		}),
		thesaurus: _path.match(/[^/]+/g)[1],
		thesaurusReference
	};
}
