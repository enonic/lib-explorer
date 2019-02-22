//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {search} from '/lib/enonic/yase/search';
import {jsonError} from '/lib/enonic/yase/jsonError';
import {jsonResponse} from '/lib/enonic/yase/jsonResponse';


export function get({params}) {
	//log.info(toStr({params}));
	if (!params.interface) { return jsonError('Required param interface missing!'); }
	return jsonResponse(search(params));
} // function get
