import traverse from 'traverse';

import {newCache} from '/lib/cache';
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';

import {
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {getCachedActiveNode} from '/lib/explorer/client/getCachedActiveNode';
import {buildStaticFiltersFromInterface} from '/lib/explorer/client/buildStaticFiltersFromInterface';

import {query as queryCollections} from '/lib/explorer/collection/query';

//const {currentTimeMillis: getTime} = Java.type('java.lang.System');


//──────────────────────────────────────────────────────────────────────────────
// Private constants
//──────────────────────────────────────────────────────────────────────────────
const CONFIG_CACHE = newCache({
	expire: 60 * 60 * 8, // 8 hours
	size: 100 // One per interface
});


const CONNECTION = connect({
	principals: [PRINCIPAL_EXPLORER_READ]
});


//──────────────────────────────────────────────────────────────────────────────
// Private functions
//──────────────────────────────────────────────────────────────────────────────
function convert(node) {
	traverse(node).forEach(function(value) { // Fat arrow destroys this
		const key = this.key;
		if ([
			'collections',
			'expressions',
			'facets',
			'fields',
			'resultMappings',
			'stopWords'
		].includes(key)) {
			if (!value) {
				this.update([]);
			} else if (!Array.isArray(value)) { // Convert single value to array
				const array = [value];
				convert(array); // Recurse
				this.update(array);
			}
		} // if key
	}); // traverse
} // convert

function buildConfig(key) {
	const interfaceNode = CONNECTION.get(key);
	convert(interfaceNode);
	//log.info(`interfaceNode:${toStr(interfaceNode)}`);

	if (interfaceNode._name === 'default') {
		const allCollectionNames = queryCollections({
			connection: CONNECTION
		}).hits.map(c => c._name);
		//log.info(toStr({allCollectionNames}));
		interfaceNode.collections = allCollectionNames;
	}

	if (!interfaceNode.collections) {
		log.warning(`The interface with key:${key} has no collections!`)

		// Avoid querying ALL REPOS! https://github.com/enonic/xp/issues/8239
		throw new Error(`The interface with name:${interfaceNode._name} has no collections!`);
		//interfaceNode.collections = [];
	}

	const config = {
		aggregations: {},
		facetsObj: {},
		filters: buildStaticFiltersFromInterface(interfaceNode.filters),
		interfaceNode,
		sources: interfaceNode.collections.map(collection => ({
			repoId: `${COLLECTION_REPO_PREFIX}${collection}`,
			branch: 'master', // NOTE Hardcoded
			principals: [PRINCIPAL_EXPLORER_READ]
		}))
	};
	//log.info(toStr({config}));
	if (config.interfaceNode.facets) {
		config.interfaceNode.facets.forEach(({tag: field, facets}) => {
			const obj = {};
			facets.forEach(({tag}) => {
				obj[tag] = true;
			});
			config.facetsObj[field] = obj;
			config.aggregations[field] = {
				terms: {
					field,
					order: 'count desc', // '_term asc'
					size: 100 // We can't use facets.length because there could be documents with values that are not in facetsConfig
				}
			}
		});
	}
	//log.info(toStr({config}));
	return config;
}


const getCachedConfig = (key) => CONFIG_CACHE.get(key, () => buildConfig(key));


//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
// How to cache interface?
// 1. On first request:
//  1.1 Get interfaceNode from interfaceKey
//  1.2 Generate and cache static things (unaffected by params)
// 2. On second request
//  2.1 getCachedInterfaceNode(interfaceKey)
//  2.2 If getActiveVersion(interfaceKey) matches cachedInterfaceNode._versionkey
//        Reuse cached static things
//      or
//        Generate and cache static things
//
// Potential problems:
// The interfaceNode contains references to other nodes that can also change...
export function getCachedConfigFromInterface({
	interfaceName
}) {
	const key = `/interfaces/${interfaceName}`;
	//log.info(toStr({key}));
	//const beforeGetTime = getTime();
	const cachedConfig = getCachedConfig(key);
	//log.info(`${key}: ${getTime() - beforeGetTime}ms Getting cached config`);

	//const beforeCompareVersion = getTime();
	if (CONNECTION.getActiveVersion({key}).versionId === cachedConfig.interfaceNode._versionKey) {
		//log.info(`${key}: ${getTime() - beforeCompareVersion}ms Comparing version`);
		return cachedConfig;
	}

	/* This API only existed in libCache-2.1.0 and was unsafe
	const beforeUpdateTime = getTime();
  const updatedConfig = CONFIG_CACHE.update(key, () => buildConfig(key));
	log.info(`${key}: ${getTime() - beforeUpdateTime}ms Updating cached config`);
	return updatedConfig;*/

	//const beforeRecacheTime = getTime();
	CONFIG_CACHE.remove(key);
	return getCachedConfig(key);
	/*const reCachedConfig = getCachedConfig(key);
	log.info(`${key}: ${getTime() - beforeRecacheTime}ms Recached config`);
	return reCachedConfig;*/
} // function getCachedConfigFromInterface
