//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/util';
import {hash} from '/lib/explorer/string/hash';


//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function cachedQuery({
	connection,
	params,
	queriesObj
}) {
	const key = hash(JSON.stringify(params));
	if (!queriesObj[key]) { queriesObj[key] = connection.query(params); }
	return queriesObj[key];
}
