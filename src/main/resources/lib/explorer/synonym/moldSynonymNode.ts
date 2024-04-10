import type {
	Synonym,
	SynonymNode
} from '@enonic-types/lib-explorer';


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
	nodeTypeVersion,
	thesaurusReference
}: SynonymNode): Synonym {
	return {
		_id,
		_name,
		_nodeType,
		_nodeTypeVersion: nodeTypeVersion,
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
