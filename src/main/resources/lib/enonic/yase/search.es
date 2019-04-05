//──────────────────────────────────────────────────────────────────────────────
// Node modules (webpacked since relative path)
//──────────────────────────────────────────────────────────────────────────────
import traverse from 'traverse';

//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {newCache} from '/lib/cache';
import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';
import {getLocale} from '/lib/xp/admin';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	COLLECTION_REPO_PREFIX,
	ROLE_YASE_READ,
	ROLE_YASE_ADMIN
} from '/lib/enonic/yase/constants';
import {buildFacets} from '/lib/enonic/yase/buildFacets';

import {buildFilters} from '/lib/enonic/yase/search/buildFilters';

import {buildPagination} from '/lib/enonic/yase/buildPagination';
import {buildQuery} from '/lib/enonic/yase/buildQuery';
import {cachedQuery} from '/lib/enonic/yase/cachedQuery';
import {connect} from '/lib/enonic/yase/repo/connect';
import {multiConnect} from '/lib/enonic/yase/repo/multiConnect';
import {localizeFacets} from '/lib/enonic/yase/localizeFacets';
import {mapMultiRepoQueryHits} from '/lib/enonic/yase/mapMultiRepoQueryHits';
import {query as queryThesauri} from '/lib/enonic/yase/thesaurus/query';

//import {removeStopWords} from '/lib/enonic/yase/query/removeStopWords';
import {wash} from '/lib/enonic/yase/query/wash';
import {flattenSynonyms} from '/lib/enonic/yase/search/flattenSynonyms';

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


	const yaseReadConnection = connect({
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
		filters: filtersConfig,
		pagination: paginationConfig,
		query: queryConfig,
		resultMappings,
		thesauri
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

	const washedSearchString = wash({string: searchString});
	//log.info(toStr({washedSearchString}));

	//const searchStringWithoutStopWords = removeStopWords({string: washedSearchString});

	const synonyms = [];
	const expand = false;
	const query = buildQuery({
		expand,
		expression: queryConfig,
		searchString: washedSearchString,
		synonyms
	});
	//log.info(toStr({synonyms}));
	log.info(toStr({query}));

	const thesauriMap = {};
	queryThesauri({
		getSynonymsCount: false
	}).hits.forEach(({name, displayName}) => {
		thesauriMap[name] = displayName;
	});
	//log.info(toStr({thesauriMap}));

	const flattenedSynonyms = [searchString];
	flattenSynonyms({
		array: flattenedSynonyms,
		expand,
		synonyms
	});

	const synonymsObj = {};
	synonyms.forEach(({thesaurus, score, from, to}) => {
		const thesaurusName = thesauriMap[thesaurus];
		if(!synonymsObj[thesaurusName]) {
			synonymsObj[thesaurusName] = {};
		}
		forceArray(from).forEach(f => {
			if(!synonymsObj[thesaurusName][f]) { synonymsObj[thesaurusName][f] = {score, to}}
		});
	});
	//log.info(toStr({synonymsObj}));


	const localizedFacets = localizeFacets({
		facets: facetConfig,
		locale,
		nodeCache: NODE_CACHE
	});
	//log.info(toStr({localizedFacets}));

	const filters = buildFilters(filtersConfig);
	//log.info(toStr({filters}));

	const yaseReadConnections = multiConnect({
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
	//log.info(toStr({count}));

	const queryRes = cachedQuery({
		cache: QUERY_CACHE,
		connection: yaseReadConnections,
		params: queryParams
	});
	const {hits, total} = queryRes;
	//log.info(toStr({total}));

	const pages = Math.ceil(total / count);
	//log.info(toStr({pages}));

	const pagination = buildPagination({
		facets: facetsParam,
		locale,
		name,
		page,
		pages,
		paginationConfig,
		searchString
	});
	//log.info(toStr({pagination}));

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
		count: queryRes.count,
		expand,
		pages,
		total,
		synonymsObj,
		hits: mapMultiRepoQueryHits({
			hits,
			locale,
			nodeCache: NODE_CACHE,
			resultMappings,
			searchString: flattenedSynonyms.join(' ')
		}),
		facetCategories,
		pagination
	};
} // function search
