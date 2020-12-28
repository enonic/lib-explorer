//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {newCache} from '/lib/cache';
import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {getLocale} from '/lib/xp/admin';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	//COLLECTION_REPO_PREFIX,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';

//import {get as getInterface} from '/lib/explorer/interface/get';
import {removeStopWords} from '/lib/explorer/query/removeStopWords';
import {wash} from '/lib/explorer/query/wash';
import {connect} from '/lib/explorer/repo/connect';
import {multiConnect} from '/lib/explorer/repo/multiConnect';
import {get as getStopWordsList} from '/lib/explorer/stopWords/get';
import {hash} from '/lib/explorer/string/hash';

//import {addCommonTermsFilter} from '/lib/explorer/client/addCommonTermsFilter';
import {buildFacets} from '/lib/explorer/client/buildFacets';
import {buildFiltersFromParams} from '/lib/explorer/client/buildFiltersFromParams';
import {buildHighlights} from '/lib/explorer/client/buildHighlights';
import {buildPagination} from '/lib/explorer/client/buildPagination';
import {buildQuery} from '/lib/explorer/client/buildQuery';
//import {flattenSynonyms} from '/lib/explorer/client/flattenSynonyms';
//import {getCachedActiveNode} from '/lib/explorer/client/getCachedActiveNode';
import {getCachedConfigFromInterface} from '/lib/explorer/client/getCachedConfigFromInterface';
import {localizeFacets} from '/lib/explorer/client/localizeFacets';
import {mapMultiRepoQueryHits} from '/lib/explorer/client/mapMultiRepoQueryHits';

import {query as queryThesauri} from '/lib/explorer/thesaurus/query';

//import {pad} from '/lib/explorer/string/pad';

//const {currentTimeMillis} = Java.type('java.lang.System');

//──────────────────────────────────────────────────────────────────────────────
// Private constants
//──────────────────────────────────────────────────────────────────────────────

// Used for:
// * fields
// * fieldValues
const NODE_CACHE = newCache({
	expire: 60 * 60, // 1 hour
	size: 100
});

// Stop-words and synonyms are not currently cached :)


//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function search(params) {
	log.debug(`params:${toStr({params})}`);
	//const times = [{label: 'start', time: currentTimeMillis()}];

	if (!params.interface) {
		throw new Error('Missing required parameter interface!');
	}

	const {
		clearCache = false,
		explain = false,
		facets: facetsParam = {},
		interface: interfaceName,
		locale = getLocale(),
		logQuery = false,
		logQueryResults = false,
		//logSynonyms = false,
		name = 'q',
		searchString = params[name] || ''
	} = params;
	log.debug(`clearCache:${toStr({clearCache})}`);
	log.debug(`explain:${toStr({explain})}`);
	log.debug(`facetsParam:${toStr({facetsParam})}`);
	log.debug(`interfaceName:${toStr({interfaceName})}`);
	log.debug(`locale:${toStr({locale})}`);
	log.debug(`logQuery:${toStr({logQuery})}`);
	log.debug(`logQueryResults:${toStr({logQueryResults})}`);
	log.debug(`name:${toStr({name})}`);
	log.debug(`searchString:${toStr({searchString})}`);

	if (clearCache) {
		log.info('Clearing node cache.');
		NODE_CACHE.clear();
	}

	const explorerRepoReadConnection = connect({
		principals: [PRINCIPAL_EXPLORER_READ]
	});

	const config = getCachedConfigFromInterface({interfaceName});
	log.debug(`config:${toStr({config})}`);

	const {
		facets: facetConfig,
		//pagination: paginationConfig,
		query: queryConfig,
		resultMappings,
		stopWords//,
		//thesauri
	} = config.interfaceNode;
	log.debug(`facetConfig:${toStr({facetConfig})}`);
	log.debug(`queryConfig:${toStr({queryConfig})}`);
	log.debug(`resultMappings:${toStr({resultMappings})}`);
	log.debug(`stopWords:${toStr({stopWords})}`);

	let page = params.page ? parseInt(params.page, 10) : 1; // NOTE First index is 1 not 0
	log.debug(`page:${toStr({page})}`);

	const count = params.count ? parseInt(params.count, 10) : 10;
	//const count = 1; // DEBUG
	log.debug(`count:${toStr({count})}`);

	const start = params.start ? parseInt(params.start, 10) : (page - 1) * count; // NOTE First index is 0 not 1
	log.debug(`start:${toStr({start})}`);

	if (!page) { page = Math.floor(start / count) + 1; }
	log.debug(`page:${toStr({page})}`);

	const washedSearchString = wash({string: searchString});
	log.debug(`washedSearchString:${toStr({washedSearchString})}`);

	//times.push({label: 'various', time: currentTimeMillis()});

	// TODO stopWords could be cached:
	const listOfStopWords = [];
	if (stopWords && stopWords.length) {
		stopWords.forEach((name) => {
			const {words} = getStopWordsList({ // Not a query
				connection: explorerRepoReadConnection,
				name
			});
			//log.info(toStr({words}));
			words.forEach((word) => {
				if (!listOfStopWords.includes(word)) {
					listOfStopWords.push(word);
				}
			});
		});
	}
	log.debug(`listOfStopWords:${toStr({listOfStopWords})}`);

	const removedStopWords = [];
	const searchStringWithoutStopWords = removeStopWords({
		removedStopWords,
		stopWords: listOfStopWords,
		string: washedSearchString
	});
	log.debug(`searchStringWithoutStopWords:${toStr({searchStringWithoutStopWords})}`);
	/*log.info(toStr({
		washedSearchString,
		removedStopWords
	}));*/
	//times.push({label: 'stopwords', time: currentTimeMillis()});

	const synonyms = [];
	const expand = false;
	//if (logSynonyms) { log.info(`expand:${toStr(expand)}`); }
	const query = buildQuery({
		connection: explorerRepoReadConnection,
		expand,
		explain,
		expression: queryConfig,
		logQuery,
		logQueryResults,
		//logSynonyms,
		//searchString: washedSearchString,
		searchString: searchStringWithoutStopWords,
		synonyms//,
		//times
	});
	log.debug(`query:${toStr({query})}`);

	//if (logSynonyms) { log.info(`synonyms:${toStr(synonyms)}`); }
	//log.info(toStr({query}));
	//times.push({label: 'query', time: currentTimeMillis()});

	const thesauriMap = {};
	queryThesauri({
		connection: explorerRepoReadConnection,
		explain,
		logQuery,
		logQueryResults,
		getSynonymsCount: false
	}).hits.forEach(({name, displayName}) => {
		thesauriMap[name] = displayName;
	});
	log.debug(`thesauriMap:${toStr({thesauriMap})}`);
	//times.push({label: 'thesauri', time: currentTimeMillis()});

	/*const flattenedSynonyms = [searchString];
	flattenSynonyms({
		array: flattenedSynonyms,
		expand,
		synonyms
	});*/

	const synonymsObj = {};
	synonyms.forEach(({thesaurus, score, from, to}) => {
		const thesaurusName = thesauriMap[thesaurus];
		if(!synonymsObj[thesaurusName]) {
			synonymsObj[thesaurusName] = {};
		}
		forceArray(from).forEach(f => {
			if(!synonymsObj[thesaurusName][f]) {
				synonymsObj[thesaurusName][f] = {score, to};
			}
		});
	});
	log.debug(`synonymsObj:${toStr({synonymsObj})}`);
	//times.push({label: 'synonyms', time: currentTimeMillis()});


	// TODO This could be cached
	const localizedFacets = {};
	if (facetConfig) {
		localizeFacets({
			facets: facetConfig,
			locale,
			localizedFacets,
			nodeCache: NODE_CACHE
		});
	}
	log.debug(`localizedFacets:${toStr({localizedFacets})}`);
	//times.push({label: 'localize', time: currentTimeMillis()});

	const filters = buildFiltersFromParams({
		facetsParam,
		facetsObj: config.facetsObj,
		staticFilters: config.filters
	});
	log.debug(`filters:${toStr({filters})}`);
	//times.push({label: 'buildFiltersFromParams', time: currentTimeMillis()});

	/*addCommonTermsFilter({
		commonWords: listOfStopWords,
		filtersObjToModify: filters,
		searchString: washedSearchString
	});
	log.info(toStr({filters}));*/

	const multiConnectParams = {
		principals: [PRINCIPAL_EXPLORER_READ],
		sources: config.sources
	};
	if(logQuery) {
		log.info(`multiConnectParams:${toStr(multiConnectParams)}`);
	} else {
		log.debug(`multiConnectParams:${toStr(multiConnectParams)}`);
	}

	const readConnections = multiConnect(multiConnectParams);
	//times.push({label: 'multiConnect', time: currentTimeMillis()});

	const numberOfActiveFacetCategories = Object.keys(facetsParam).filter(k => facetsParam[k]).length;
	log.debug(`numberOfActiveFacetCategories:${toStr({numberOfActiveFacetCategories})}`);

	const queryParams = {
		count,
		explain,
		filters,
		// No point in building highlights when there is nothing to highlight...
		highlight: searchStringWithoutStopWords ? buildHighlights({
			resultMappings
		}) : {},
		query,
		start
	};
	if (!facetConfig || numberOfActiveFacetCategories !== facetConfig.length) {
		queryParams.aggregations = config.aggregations;
	}
	//log.info(toStr({count}));
	if (logQuery) {
		log.info(`queryParams:${toStr(queryParams)}`);
	} else {
		log.debug(`queryParams:${toStr({queryParams})}`);
	}

	const queryRes = readConnections.query(queryParams);
	if (logQueryResults) {
		log.info(`queryRes:${toStr(queryRes)}`);
	} else {
		log.debug(`queryRes:${toStr({queryRes})}`);
	}

	const aggregationsCacheObj = {};
	if (Object.keys(queryRes.aggregations).length) {
		const aggregationCacheKey = hash(filters, 52);
		aggregationsCacheObj[aggregationCacheKey] = queryRes.aggregations;
	}
	log.debug(`aggregationsCacheObj:${toStr({aggregationsCacheObj})}`);

	const {hits, total} = queryRes;
	//log.info(toStr({total}));
	//times.push({label: 'result', time: currentTimeMillis()});

	// If there are no selected facets we can fetch all facet numbers from main query.
	//
	// If there is a selected facet in one category (A) we need two queries:
	// Main query is filtered on A and produce numbers for B and C.
	// Numbers for category A can be fetched from a query without filters
	//
	// If there is a selected facet in two categories (A, B) we need three queries:
	// Main query is filtered on A and B and produce numbers for C.
	// Numbers for category A can be fetched from a query with filter on B.
	// Numbers for category B can be fetched from a query with filter on A.
	//
	// If there is a selected facet in all three categories (A, B, C) we need four queries:
	// Main query is filtered on A, B and C, and cannot be used for numbers.
	// Numbers for category A can be fetched from a query with filter on B and C.
	// Numbers for category B can be fetched from a query with filter on A and C.
	// Numbers for category C can be fetched from a query with filter on A and B.
	const facetCategories = buildFacets({
		aggregationsCacheObj,
		aggregations: config.aggregations,
		facetConfig,
		filters,
		localizedFacets,
		multiRepoConnection: readConnections,
		params,
		query//,
		//times
	});
	log.debug(`facetCategories:${toStr({facetCategories})}`);
	//times.push({label: 'facets', time: currentTimeMillis()});
	//log.info(toStr({aggregationsCacheObj}));

	const pages = Math.ceil(total / count);
	log.debug(`pages:${toStr({pages})}`);

	const pagination = buildPagination({
		facets: facetsParam,
		locale,
		name,
		page,
		pages,
		//paginationConfig,
		searchString: washedSearchString
	});
	log.debug(`pagination:${toStr({pagination})}`);
	//times.push({label: 'pagination', time: currentTimeMillis()});

	//const response = {
	return {
		params: {
			count,
			facets: facetsParam,
			interface: interfaceName,
			locale,
			name,
			page,
			searchString: washedSearchString,
			start
		},
		count: queryRes.count,
		expand,
		pages,
		total,
		removedStopWords,
		synonymsObj,
		hits: mapMultiRepoQueryHits({
			facets: facetsParam,
			hits,
			locale,
			urlQueryParameterNameContainingSearchString: name,
			nodeCache: NODE_CACHE,
			resultMappings,
			searchString: washedSearchString
			//times
		}),
		facetCategories,
		pagination
	};
	/*times.push({label: 'mapMultiRepoQueryHits', time: currentTimeMillis()});
	for (let i = 0; i < times.length - 1; i += 1) {
		const dur = times[i + 1].time - times[i].time;
		log.info(`${searchStringWithoutStopWords} ${pad(dur, 4)} ${pad(times[i + 1].time - times[0].time, 4)} ${times[i + 1].label}`);
	}
	//const dur = times[times.length - 1].time - times[0].time;
	//log.info(`${searchStringWithoutStopWords} ${pad(dur, 4)} total`);
	log.info('────────────────────────────────────────────────────────────────────────────────');
	return response;*/
} // function search
