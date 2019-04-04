import {forceArray} from '/lib/enonic/util/data';


export function flattenSynonyms({
	expand = false,
	synonyms
}) {
	const array = [];
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
