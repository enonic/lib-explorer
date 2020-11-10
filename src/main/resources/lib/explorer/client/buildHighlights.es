import setIn from 'set-value';

//import {toStr} from '/lib/util';
import {isInt} from '/lib/util/value';


const FRAGMENTER_DEFAULT = 'span';
const FRAGMENT_SIZE_DEFAULT = 255;
const NUMBER_OF_FRAGMENTS_DEFAULT = 1;
const ORDER_DEFAULT = 'none';
const POST_TAG_DEFAULT = '</b>';
const PRE_TAG_DEFAULT = '<b>';

const trunc = (number) => ~~number;
//const trunc = (number) => number|0;
//const trunc = (number) => number - number % 1;
const toInt = (value) => trunc(Number(value));


export function buildHighlights({resultMappings}) {
	const highlights = {
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
			//Math.round(parseFloat(highlightNumberOfFragments))
			//const intHighlightNumberOfFragments = Math.trunc(parseInt(highlightNumberOfFragments, 10));
			const intHighlightNumberOfFragments = toInt(highlightNumberOfFragments);
			if (!isInt(highlights.numberOfFragments)) { // 0 is falsy
				highlights.numberOfFragments = intHighlightNumberOfFragments;
			}

			const intFragmentSize = toInt(fragmentSize);
			if (!isInt(highlights.fragmentSize)) { // 0 is falsy
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
				fragmentSize : intFragmentSize !== highlights.fragmentSize ? intFragmentSize : undefined,
				numberOfFragments: intHighlightNumberOfFragments !== highlights.numberOfFragments ? intHighlightNumberOfFragments : undefined,
				order: highlightOrder !== highlights.order ? highlightOrder : undefined,
				postTag: highlightPostTag !== highlights.postTag ? highlightPostTag : undefined,
				preTag: highlightPreTag !== highlights.preTag ? highlightPreTag : undefined
			});
		}
	});
	//log.info(toStr({highlights}));
	return highlights;
} // function buildHighlights
