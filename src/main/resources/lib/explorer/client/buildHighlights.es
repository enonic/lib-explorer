import setIn from 'set-value';

//import {toStr} from '/lib/util';


export function buildHighlights({resultMappings}) {
	const highlights = {
		numberOfFragments: 1, // TODO Could be made configurable
		//numberOfFragments: -1, // No hits???
		order: 'score', // Sorts highlighted fragments by score when set to score. Defaults to none - will be displayed in the same order in which fragments appear in the property.
		postTag: '</b>',
		preTag: '<b>'
	};
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
