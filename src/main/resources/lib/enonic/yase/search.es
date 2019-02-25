//──────────────────────────────────────────────────────────────────────────────
// Node modules (webpacked since relative path)
//──────────────────────────────────────────────────────────────────────────────
import traverse from 'traverse';

//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {newCache} from '/lib/cache';
//import {toStr} from '/lib/enonic/util';
import {getLocale} from '/lib/xp/admin';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	COLLECTION_REPO_PREFIX,
	ROLE_YASE_READ,
	ROLE_YASE_ADMIN
} from '/lib/enonic/yase/constants';
import {buildPagination} from '/lib/enonic/yase/buildPagination';
import {buildQuery} from '/lib/enonic/yase/buildQuery';
import {cachedQuery} from '/lib/enonic/yase/cachedQuery';
import {connectRepo} from '/lib/enonic/yase/connectRepo';
import {connectRepos} from '/lib/enonic/yase/connectRepos';
import {localizeFacets} from '/lib/enonic/yase/localizeFacets';
import {buildFacets} from '/lib/enonic/yase/buildFacets';
import {mapMultiRepoQueryHits} from '/lib/enonic/yase/mapMultiRepoQueryHits';
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
		facets: facetsParam,
		interface: interfaceName,
		locale = getLocale(),
		name = 'q',
		searchString = params[name] || ''
	} = params;
	/*log.info(toStr({
		facetsParam,
		interfaceName,
		name,
		searchString
	}));*/

	if (clearCache) {
		log.info('Clearing node and query cache.');
		NODE_CACHE.clear();
		QUERY_CACHE.clear();
	}


	const yaseReadConnection = connectRepo({
		principals: [`role:${ROLE_YASE_READ}`]
	})
	const interfaceNode = getInterface({
		connection: yaseReadConnection,
		interfaceName
	});
	convert(interfaceNode);
	//log.info(toStr({interfaceNode}));

	const {
		collections,
		facets: facetConfig,
		pagination: paginationConfig,
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
	//log.info(toStr({page}));

	const count = params.count ? parseInt(params.count, 10) : 10;
	const start = params.start ? parseInt(params.start, 10) : (page - 1) * count; // NOTE First index is 0 not 1
	//log.info(toStr({start}));

	if (!page) { page = Math.floor(start / count) + 1; }

	const query = buildQuery({expression: queryConfig, searchString});

	const localizedFacets = localizeFacets({
		facets: facetConfig,
		locale,
		nodeCache: NODE_CACHE
	});

	const filters = {};

	const yaseReadConnections = connectRepos({
		principals: [`role:${ROLE_YASE_READ}`],
		sources
	});

	const facetCategories = buildFacets({
		facetConfig,
		filters, // Filters gets modified here
		localizedFacets,
		multiRepoConnection: yaseReadConnections,
		params,
		query,
		queryCache: QUERY_CACHE
	});

	const queryParams = {
		count,
		filters,
		query,
		start
	};

	const queryRes = cachedQuery({
		cache: QUERY_CACHE,
		connection: yaseReadConnections,
		params: queryParams
	});
	const {hits, total} = queryRes;

	const pages = Math.ceil(total / count);

	const pagination = buildPagination({
		facets: facetsParam,
		locale,
		name,
		page,
		pages,
		paginationConfig,
		searchString
	});

	const debug = {
		//queryConfig,
		query//,
		//collections,
		//sources,
		//resultMappings,
		//facetConfig,
		//localizedFacets,
		//filters,
		//hits,
		//paginationConfig
	};

	return {
		params: {
			count,
			facets: facetsParam,
			interface: interfaceName,
			locale,
			name,
			searchString,
			start
		},
		debug, // WARNING This should be commented out in production mode!
		pages,
		pagination,
		count: queryRes.count,
		total,
		facetCategories,
		hits: mapMultiRepoQueryHits({
			hits,
			locale,
			nodeCache: NODE_CACHE,
			resultMappings,
			searchString
		})
	};
} // function search
