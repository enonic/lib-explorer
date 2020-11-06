import setIn from 'set-value';

import {toStr} from '/lib/util';
import {isInt} from '/lib/util/value';


const FRAGMENTER_DEFAULT = 'span';
const FRAGMENT_SIZE_DEFAULT = 255;
const NUMBER_OF_FRAGMENTS_DEFAULT = 1;
const ORDER_DEFAULT = 'none';
const POST_TAG_DEFAULT = '</b>';
const PRE_TAG_DEFAULT = '<b>';


export function buildHighlights({resultMappings}) {
	const highlights = {
		/*fragmenter: FRAGMENTER_DEFAULT,
		fragmentSize: FRAGMENT_SIZE_DEFAULT,
		numberOfFragments: NUMBER_OF_FRAGMENTS_DEFAULT,
		//numberOfFragments: -1, // No hits???

		// Sorts highlighted fragments by score when set to score.
		// Defaults to none - will be displayed in the same order in which fragments appear in the property.
		order: ORDER_DEFAULT,
		//order: 'score', // NOTE Perhaps slow when lots of text? (example from PDF).

		postTag: POST_TAG_DEFAULT, // Default </em>
		preTag: PRE_TAG_DEFAULT // Default <em>*/
	};
	resultMappings.forEach(({
		field,
		highlight,
		highlightFragmenter = FRAGMENTER_DEFAULT,
		highlightNumberOfFragments = NUMBER_OF_FRAGMENTS_DEFAULT,
		highlightOrder = ORDER_DEFAULT,
		highlightPostTag = POST_TAG_DEFAULT,
		highlightPreTag = PRE_TAG_DEFAULT,
		lengthLimit: fragmentSize = FRAGMENT_SIZE_DEFAULT
	}) => {
		if (highlight) {
			const intHighlightNumberOfFragments = parseInt(highlightNumberOfFragments, 10);
			if (!isInt(highlights.numberOfFragments)) {
				highlights.numberOfFragments = intHighlightNumberOfFragments;
			}
			const intFragmentSize = parseInt(fragmentSize, 10);
			if (!isInt(highlights.fragmentSize)) {
				highlights.fragmentSize = intFragmentSize;
			}
			if(!highlights.fragmenter) {
				highlights.fragmenter = highlightFragmenter;
			}
			if(!highlights.order) {
				highlights.order = highlightOrder;
			}
			if(!highlights.postTag) {
				highlights.postTag = highlightPostTag;
			}
			if(!highlights.preTag) {
				highlights.preTag = highlightPreTag;
			}
			setIn(highlights, `properties.${field}`, {
				fragmenter: highlightFragmenter !== highlights.fragmenter ? highlightFragmenter : undefined,

				//fragmentSize : intFragmentSize !== highlights.fragmentSize ? intFragmentSize : undefined,
				fragmentSize : intFragmentSize,

				//numberOfFragments: intHighlightNumberOfFragments !== highlights.numberOfFragments ? intHighlightNumberOfFragments : undefined,
				numberOfFragments: intHighlightNumberOfFragments,

				order: highlightOrder !== highlights.order ? highlightOrder : undefined,
				postTag: highlightPostTag !== highlights.postTag ? highlightPostTag : undefined,
				preTag: highlightPreTag !== highlights.preTag ? highlightPreTag : undefined
			});
		}
	});
	//log.info(toStr({highlights}));
	return highlights;
} // function buildHighlights
