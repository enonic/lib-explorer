//──────────────────────────────────────────────────────────────────────────────
// Node modules (webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '@enonic/js-utils';
import {normalize as n, parse, serialize} from 'uri-js';


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
