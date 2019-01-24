//──────────────────────────────────────────────────────────────────────────────
// Node modules (webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {normalize as n, parse, serialize} from 'uri-js';


//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';


//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function normalize(url) {
	//log.debug(toStr({url}));
	const uriObj = parse(url);
	delete uriObj.fragment;
	const normalizedUrl = n(serialize(uriObj));
	//log.debug(toStr({normalizedUrl}));
	return normalizedUrl;
}
