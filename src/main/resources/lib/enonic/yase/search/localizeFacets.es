//import {toStr} from '/lib/util';
import {getLocale} from '/lib/xp/admin';

import {localizeTag} from '/lib/enonic/yase/search/localizeTag';


export function localizeFacets({
	facets,
	locale = getLocale(),
	localizedFacets = {}, // Passed by reference and modified recursivly
	nodeCache,
	parentPath = '/fields'
}) {
	//log.info(toStr({facets, locale}));
	//const {tag, facets: children} = facets[0]; // DEBUG
	facets.forEach(({tag, facets: children}) => {
		const path = `${parentPath}/${tag}`;
		const localizedTag = localizeTag({
			locale,
			nodeCache,
			parentPath,
			name: tag
		});
		localizedFacets[path] = localizedTag;
		//return localizedFacets; // DEBUG
		if (Array.isArray(children) && children.length) {
			localizeFacets({ // Recurse
				facets: children,
				locale,
				localizedFacets, // Passed by reference and modified recursivly
				nodeCache,
				parentPath: `${parentPath}/${tag}`
			});
		}
	}); // facets.forEach
	//log.info(toStr({localizedFacets}));

	// Return in case an obj reference is not passed in when first called.
	return localizedFacets;
} // function localizeFacets
