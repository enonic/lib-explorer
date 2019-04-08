//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';
import {hash} from '/lib/enonic/yase/string/hash';


//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export const cachedQuery = ({cache, connection, params}) => {
	const key = hash(JSON.stringify(params)); // TODO Perhaps this becomes too long? Use one way hash with low collision?
	//log.info(toStr({params, key}));
	return cache.get(key, () => connection.query(params));
	/*let fromCache = true;
	const res = cache.get(key, () => {
		fromCache = false;
		return connection.query(params);
	});
	log.info(toStr({key, fromCache}));
	return res;*/
};
