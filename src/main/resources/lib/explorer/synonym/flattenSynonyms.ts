import type {SynonymsArray} from './index.d';

import {forceArray} from '@enonic/js-utils';


export function flattenSynonyms({
	// Required
	synonyms,
	// Optional
	array = [],
	expand = false,
} :{
	// Required
	synonyms :SynonymsArray
	// Optional
	array ?:Array<string>
	expand ?:boolean
}) {
	synonyms.forEach(({from, to}) => {
		if(expand) {
			forceArray(from).forEach(f => {
				if (!array.includes(f)) { array.push(f); }
			});
		}
		forceArray(to).forEach(t => {
			if (!array.includes(t)) { array.push(t); }
		});
	});
	return array;
}
