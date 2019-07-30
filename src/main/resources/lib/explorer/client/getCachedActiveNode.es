import {newCache} from '/lib/cache';
import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';


//const {currentTimeMillis: getTime} = Java.type('java.lang.System');


const NODE_CACHE = newCache({
	expire: 60 * 60 * 8, // 8 hours
	size: 100
});


const CONNECTION = connect({
	principals: [PRINCIPAL_EXPLORER_READ]
});


const getCachedNode = (key) => NODE_CACHE.get(key, () => CONNECTION.get(key));


export function getCachedActiveNode({
	key
}) {
	//const startTime = getTime();
  const cachedNode = getCachedNode(key);
	//log.info(`${key}: ${getTime() - startTime}ms Getting cached node`);

	//const beforeCompareVersion = getTime();
	if (CONNECTION.getActiveVersion({key}).versionId === cachedNode._versionKey) {
		//log.info(`${key}: ${getTime() - beforeCompareVersion}ms Comparing version`);
		return cachedNode;
	}
	//const beforeRemoveTime = getTime();
	NODE_CACHE.remove(key);
	//log.info(`${key}: ${getTime() - beforeRemoveTime}ms Removing key from cache`);
	//const beforeRecacheTime = getTime();
	return getCachedNode(key);
	/*const reCachedNode = getCachedNode(key);
	log.info(`${key}: ${getTime() - beforeRecacheTime}ms Recaching node`);
	return reCachedNode;*/
} // function getCachedActiveNode
