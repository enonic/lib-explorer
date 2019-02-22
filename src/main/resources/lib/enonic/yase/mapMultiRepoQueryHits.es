//──────────────────────────────────────────────────────────────────────────────
// Node modules (webpacked)
//──────────────────────────────────────────────────────────────────────────────
import highlightSearchResult from 'highlight-search-result';
//import {get, set} from 'lodash'; // Cannot read property "Array" from undefined
import set from 'set-value';

//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';
import {dlv as get} from '/lib/enonic/util/object';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {cachedNode} from '/lib/enonic/yase/cachedNode';


export function mapMultiRepoQueryHits({
	hits,
	nodeCache,
	resultMappings,
	searchString
}) {
	return hits.map(hit => {
		const {repoId, branch, id} = hit;
		//log.info(toStr({repoId, branch, id}));

		const node = cachedNode({
			cache: nodeCache, repoId, branch, id
		});
		//log.info(toStr({node}));

		const obj={};
		resultMappings.forEach(({
			field,
			highlight,
			lengthLimit,
			to
		}) => {
			/*log.info(toStr({
				field,
				highlight,
				lengthLimit,
				to
			}));*/

			const textToHighlight = get(node, field, '');
			//log.info(toStr({textToHighlight}));

			let v;
			if (highlight) {
				v = highlightSearchResult(textToHighlight, searchString, lengthLimit || textToHighlight.length, str => `<b>${str}</b>`);
			} else {
				v = lengthLimit
					? textToHighlight.substring(0, lengthLimit)
					: textToHighlight;
			}
			//log.info(toStr({v}));
			set(obj, to, v);
		})
		//log.info(toStr({obj}));
		return obj;
	});
} // function mapMultiRepoQueryHits
