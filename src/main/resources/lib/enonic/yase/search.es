//──────────────────────────────────────────────────────────────────────────────
// Node modules (webpacked since relative path)
//──────────────────────────────────────────────────────────────────────────────
import traverse from 'traverse';

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
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_YASE_READ
} from '/lib/enonic/yase/constants';

import {get as getInterface} from '/lib/enonic/yase/interface/get';
import {get as getStopWordsList} from '/lib/enonic/yase/stopWords/get';

import {removeStopWords} from '/lib/enonic/yase/query/removeStopWords';
import {wash} from '/lib/enonic/yase/query/wash';

import {connect} from '/lib/enonic/yase/repo/connect';
import {multiConnect} from '/lib/enonic/yase/repo/multiConnect';

import {buildFacets} from '/lib/enonic/yase/search/buildFacets';
import {buildFilters} from '/lib/enonic/yase/search/buildFilters';
import {buildPagination} from '/lib/enonic/yase/search/buildPagination';
import {buildQuery} from '/lib/enonic/yase/search/buildQuery';
import {cachedQuery} from '/lib/enonic/yase/search/cachedQuery';
import {flattenSynonyms} from '/lib/enonic/yase/search/flattenSynonyms';
import {localizeFacets} from '/lib/enonic/yase/search/localizeFacets';
import {mapMultiRepoQueryHits} from '/lib/enonic/yase/search/mapMultiRepoQueryHits';

import {query as queryThesauri} from '/lib/enonic/yase/thesaurus/query';


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


//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function search(params) {

	// There used to be a query cache. There was a problem when the query cache
	// contained references to nodes that was deleted. There is still a need to
	// avoid running the same query multiple times within a search due to facets
	const queriesObj = {};

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
	}


	const yaseReadConnection = connect({
		principals: [PRINCIPAL_YASE_READ]
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
		stopWords,
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
		principals: [PRINCIPAL_YASE_READ] // TODO Remove hardcode?
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

	const listOfStopWords = [];
	if (stopWords.length) {
		stopWords.forEach((name) => {
			const {words} = getStopWordsList({
				connection: yaseReadConnection,
				name
			});
			//log.info(toStr({words}));
			words.forEach((word) => {
				if (!listOfStopWords.includes(word)) {
					listOfStopWords.push(word);
				}
			})
		})
	}
	//log.info(toStr({listOfStopWords}));
	const removedStopWords = [];
	const searchStringWithoutStopWords = removeStopWords({
		removedStopWords,
		stopWords: listOfStopWords,
		string: washedSearchString
	});
	//log.info(toStr({removedStopWords}));

	const synonyms = [];
	const expand = false;
	const query = buildQuery({
		connection: yaseReadConnection,
		expand,
		expression: queryConfig,
		searchString: searchStringWithoutStopWords,
		synonyms
	});
	//log.info(toStr({synonyms}));
	log.info(toStr({query}));

	const thesauriMap = {};
	queryThesauri({
		connection: yaseReadConnection,
		getSynonymsCount: false
	}).hits.forEach(({name, displayName}) => {
		thesauriMap[name] = displayName;
	});
	//log.info(toStr({thesauriMap}));

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
		principals: [PRINCIPAL_YASE_READ],
		sources
	});

	const facetCategories = buildFacets({
		facetConfig,
		filters, // Filters gets modified here
		localizedFacets,
		multiRepoConnection: yaseReadConnections,
		params,
		queriesObj,
		query
	});

	const queryParams = {
		count,
		filters,
		query,
		start
	};
	//log.info(toStr({count}));

	const queryRes = cachedQuery({
		//cache: QUERY_CACHE,
		connection: yaseReadConnections,
		params: queryParams,
		queriesObj
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
		removedStopWords,
		synonymsObj,
		hits: mapMultiRepoQueryHits({
			hits,
			locale,
			nodeCache: NODE_CACHE,
			resultMappings,
			searchString: searchStringWithoutStopWords
			//searchString//: flattenedSynonyms.join(' ') // Synonyms add to much highlighting
		}),
		facetCategories,
		pagination
	};
} // function search
