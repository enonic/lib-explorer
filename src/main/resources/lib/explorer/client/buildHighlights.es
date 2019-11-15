import setIn from 'set-value';

import {toStr} from '/lib/util';


export function buildHighlights({resultMappings}) {
	const highlights = {};
	resultMappings.forEach(({
		field,
		highlight,
		lengthLimit: fragmentSize
	}) => {
		if (highlight) {
			setIn(highlights, `properties.${field}`, {fragmentSize});
		}
	});
	//log.info(toStr({highlights}));
	return highlights;
} // function buildHighlights
