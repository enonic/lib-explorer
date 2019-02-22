//──────────────────────────────────────────────────────────────────────────────
// Node modules (webpacked since relative path)
//──────────────────────────────────────────────────────────────────────────────
import traverse from 'traverse';

//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {newCache} from '/lib/cache';
import {toStr} from '/lib/enonic/util';
import {getLocale} from '/lib/xp/admin';
import {multiRepoConnect} from '/lib/xp/node';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	COLLECTION_REPO_PREFIX,
	ROLE_YASE_READ
} from '/lib/enonic/yase/constants';
import {buildQuery} from '/lib/enonic/yase/buildQuery';
import {cachedQuery} from '/lib/enonic/yase/cachedQuery';
import {getInterface} from '/lib/enonic/yase/admin/interfaces/getInterface';


//──────────────────────────────────────────────────────────────────────────────
// Private constants
//──────────────────────────────────────────────────────────────────────────────
const NODE_CACHE = newCache({
	expire: 60 * 60, // 1 hour
	size: 100
});

const QUERY_CACHE = newCache({
	expire: 5 * 60, // 5 minutes
	size: 100
});


//──────────────────────────────────────────────────────────────────────────────
// Private function
//──────────────────────────────────────────────────────────────────────────────
function convert(node) {
	traverse(node).forEach(function(value) { // Fat arrow destroys this
		const key = this.key;
		if ([
			'collections',
			'expressions',
			'facets',
			'fields',
			'resultMappings'
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


//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function search(params) {
	const {
		clearCache = false,
		facets,
		interface: interfaceName,
		name = 'q',
		locale = getLocale(),
		searchString = params[name] || ''
	} = params;
	/*log.info(toStr({
		facets,
		interfaceName,
		name,
		searchString
	}));*/

	if (clearCache) {
		log.info('Clearing node and query cache.');
		NODE_CACHE.clear();
		QUERY_CACHE.clear();
	}

	const interfaceNode = getInterface({interfaceName});
	convert(interfaceNode);
	//log.info(toStr({interfaceNode}));

	const {
		collections,
		facets: facetConfig,
		query: queryConfig,
		resultMappings
	} = interfaceNode;
	/*log.info(toStr({
		collections,
		//facetConfig,
		//queryConfig,
		//resultMappings
	}));*/

	const sources = collections.map(collection => ({
		repoId: `${COLLECTION_REPO_PREFIX}${collection}`,
		branch: 'master', // NOTE Hardcoded
		principals: [`role:${ROLE_YASE_READ}`] // TODO Remove hardcode?
	}));
	//log.info(toStr({sources}));

	let page = params.page ? parseInt(params.page, 10) : 1; // NOTE First index is 1 not 0
	const count = params.count ? parseInt(params.count, 10) : 10;
	const start = params.count ? parseInt(params.start, 10) : (page - 1) * count; // NOTE First index is 0 not 1
	if (!page) { page = Math.floor(start / count) + 1; }

	const query = buildQuery({expression: queryConfig, searchString});

	const queryParams = {
		count,
		//filters,
		query,
		start
	};

	const multiRepoConnection = multiRepoConnect({sources});

	const queryRes = cachedQuery({
		cache: QUERY_CACHE,
		connection: multiRepoConnection,
		params: queryParams
	});

	const pages = Math.ceil(queryRes.total / count);

	const debug = {
		//queryConfig,
		query,
		collections//,
		//sources
	};

	return {
		params: {
			count,
			facets,
			interface: interfaceName,
			locale,
			name,
			searchString,
			start
		},
		debug, // WARNING This should be commented out in production mode!
		pages,
		//pagination,
		count: queryRes.count,
		total: queryRes.total,
		hits: queryRes.hits
	};
} // function search
