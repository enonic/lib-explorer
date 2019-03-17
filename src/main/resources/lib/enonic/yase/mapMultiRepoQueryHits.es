//──────────────────────────────────────────────────────────────────────────────
// Node modules (webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import highlightSearchResult from 'highlight-search-result';
//import {get, set} from 'lodash'; // Cannot read property "Array" from undefined
import set from 'set-value';

//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';
import {dlv as get} from '/lib/enonic/util/object';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	BRANCH_ID,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {cachedNode} from '/lib/enonic/yase/cachedNode';
//import {localizeTag} from '/lib/enonic/yase/localizeTag';
import {highlight as highlightSearchResult} from '/lib/enonic/yase/highlight';


export function mapMultiRepoQueryHits({
	hits,
	locale,
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
			to,
			type = 'string'
		}) => {
			/*log.info(toStr({
				field,
				highlight,
				lengthLimit,
				to,
				type
			}));*/

			const value = get(node, field);
			//log.info(toStr({value}));

			let mappedValue = value;
			if (type === 'string') {
				const textToHighlight = value || '';
				//log.info(toStr({textToHighlight}));

				if (highlight) {
					mappedValue = highlightSearchResult(
						textToHighlight,
						searchString,
						lengthLimit || textToHighlight.length,
						str => `<b>${str}</b>`
					);
				} else {
					mappedValue = lengthLimit
						? textToHighlight.substring(0, lengthLimit)
						: textToHighlight;
					//log.info(toStr({v}));
				}
			} else if (type === 'tags') {
				mappedValue = (value ? forceArray(value) : [])
					.map(name => {
						const path = `/tags/${field}/${name}`;
						let tagNode = {displayName: name};
						try {
							tagNode = cachedNode({
								cache: nodeCache, repoId: REPO_ID, branch: BRANCH_ID, id: path
							});
						} catch (e) {
							log.error(`Could not find node ${REPO_ID}:${BRANCH_ID}:${path}`);
						}
						return {
							displayName: tagNode.displayName,
							name,
							path,
							field
						}
					});
			}
			set(obj, to, mappedValue);
		}) // resultMappings.forEach
		//log.info(toStr({obj}));
		return obj;
	});
} // function mapMultiRepoQueryHits
