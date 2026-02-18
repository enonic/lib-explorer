import type {
	Stopword,
	StopwordNode
} from '../types.d';


import {forceArray} from '@enonic/js-utils';


export const coerseStopWordType = ({
	_id, // Needed for common GraphQL Interface Node
	_name, // Needed for common GraphQL Interface Node
	_nodeType, // Needed for common GraphQL Interface Node
	_path, // Needed for common GraphQL Interface Node
	//_score, // Not in Stopword only in extension QueriedStopword
	_versionKey, // Needed for common GraphQL Interface Node
	words
	//...rest // cleaned, not passed on
} :StopwordNode) :Stopword => ({
	_id, // Needed for common GraphQL Interface Node
	_name, // Needed for common GraphQL Interface Node
	_nodeType, // Needed for common GraphQL Interface Node
	_path, // Needed for common GraphQL Interface Node
	//_score, // Not in Stopword only in extension QueriedStopword
	_versionKey, // Needed for common GraphQL Interface Node
	words: words ? forceArray(words) : [] // No words allowed? Yes
});
