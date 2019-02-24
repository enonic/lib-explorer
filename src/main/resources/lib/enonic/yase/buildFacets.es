//──────────────────────────────────────────────────────────────────────────────
// Node modules (webpacked)
//──────────────────────────────────────────────────────────────────────────────
import merge from 'deepmerge';
import Uri from 'jsuri';
import set from 'set-value';


//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';
import {dlv} from '/lib/enonic/util/object';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {cachedQuery} from '/lib/enonic/yase/cachedQuery';


//──────────────────────────────────────────────────────────────────────────────
// Private function
//──────────────────────────────────────────────────────────────────────────────
function uriObjFromParams(params) {
	const uri = new Uri();
	Object.entries(params).forEach(([k, v]) => {
		if (![
			'name', // The enduser should not provide nor see this
			'page', // Adding or removing a facet resets pagination
			'interface', // The enduser should not provide nor see this
			'searchString' // The enduser should not provide nor see this
		].includes(k)) {
			if (Array.isArray(v)) {
				v.forEach((value) => { uri.addQueryParam(k, value); });
			} else { uri.addQueryParam(k, v); }
		}
	});
	if (params.name && params.searchString) {
		uri.addQueryParam(params.name, params.searchString);
	}
	return uri;
}


//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function buildFacets({
	facetConfig,
	filters = {},
	localizedFacets,
	multiRepoConnection,
	params,
	query,
	queryCache
}) {
	const path = 'tags';
	const hasValues = {[path]: []}; // Built in 1st pass, used in 2nd pass.
	const facetsArrayFromRequestParams = params.facets ? forceArray(params.facets) : [];
	//log.info(toStr({facetsArrayFromRequestParams}));

	//──────────────────────────────────────────────────────────────────────────
	// First pass: Localize facetName, find active/inactive facets and build links.
	//──────────────────────────────────────────────────────────────────────────
	const firstPass = facetConfig.map(({tag, facets: children}) => {
		let activeCount = 0;
		let inactiveCount = 0;
		const facetCategoryUri = uriObjFromParams(params);
		const facetCategoryClearUri = uriObjFromParams(params);
		const hasValuesInCategory = {[path]: []};

		const facets = children.map(({tag: facetTag}) => {
			const facetUri = uriObjFromParams(params);

			const active = facetsArrayFromRequestParams.includes(facetTag);

			facetUri.deleteQueryParam('facets', facetTag);
			const removeHref = facetUri.toString();
			facetUri.addQueryParam('facets', facetTag);

			facetCategoryUri.deleteQueryParam('facets', facetTag); // Avoid duplication
			facetCategoryUri.addQueryParam('facets', facetTag);
			facetCategoryClearUri.deleteQueryParam('facets', facetTag);

			if (active) {
				activeCount += 1;
				//if (!Array.isArray(hasValuesInCategory[path])) { hasValuesInCategory[path] = [];}
				hasValuesInCategory[path].push(facetTag);

				//if (!Array.isArray(hasValues[path])) { hasValues[path] = [];}
				hasValues[path].push(facetTag);
			} else {
				inactiveCount += 1;
			}
			return {
				active,
				//count, // Gets added in 2nd pass
				href: facetUri.toString(),
				name: localizedFacets[facetTag],
				removeHref,
				tag: facetTag // Gets used and removed in 2nd pass
			};
		}); // children.map

		return {
			activeCount,
			clearHref: facetCategoryClearUri.toString(),
			hasValuesInCategory, // Gets removed in 2nd pass
			href: facetCategoryUri.toString(),
			inactiveCount,
			name: localizedFacets[tag],
			facets
		}; // return
	}); //facetConfig.map
	//log.info(toStr({firstPass}));

	//──────────────────────────────────────────────────────────────────────────
	// Modify base filter
	//──────────────────────────────────────────────────────────────────────────
	//log.info(toStr({hasValues}));
	const hasValueEntries = Object.entries(hasValues); //log.info(toStr({hasValueEntries}));
	/*if (hasValueEntries.length && !dlv(filters, 'boolean.must')) {
		set(filters, 'boolean.must', []);
	}*/
	hasValueEntries.forEach(([field, values]) => {
		//log.info(toStr({field, values}));
		if (values.length) {
			if (!dlv(filters, 'boolean.must')) {
				set(filters, 'boolean.must', []);
			}
			filters.boolean.must.push({
				hasValue: {
					field,
					values
				}
			});
		}
	});
	//log.info(toStr({filters}));

	//──────────────────────────────────────────────────────────────────────────
	// Second pass: Build and do aggregation queries and apply counts.
	//──────────────────────────────────────────────────────────────────────────
	firstPass.forEach(({facets, hasValuesInCategory}, index) => {
		const filtersExceptCategory = merge.all([{}, filters]);
		//log.info(toStr({filtersExceptCategory}));

		if (hasValuesInCategory) {
			Object.entries(hasValuesInCategory).forEach(([path, values]) => {
				//log.info(toStr({path, values}));
				if (values.length) {
					filtersExceptCategory.boolean.must.forEach(({hasValue}, i) => {
						if (hasValue) {
							//log.info(toStr({hasValue}));
							if (hasValue.field === path) {
								//log.info(`hasValue.field === path:${path}`);
								const filteredValues = hasValue.values.filter(value => !values.includes(value));
								//log.info(toStr({filteredValues}));
								if (hasValue.values.length !== filteredValues.length) {
									//log.info(`hasValue.values.length:${hasValue.values.length} !== filteredValues.length:${filteredValues.length}`);
									if (filteredValues.length) {
										filtersExceptCategory.boolean.must[i].hasValue.values = filteredValues;
									} else {
										delete filtersExceptCategory.boolean.must.splice(i, 1);
										if (!filtersExceptCategory.boolean.must.length) {
											delete filtersExceptCategory.boolean.must;
											if (!Object.keys(filtersExceptCategory.boolean).length) {
												delete filtersExceptCategory.boolean;
											}
										}
									}
								}
							}
						} // if hasValue
					}); // forEach filtersExceptCategory.boolean.must
				} // if values.length
			}); // entries hasValuesInCategory

			const aggregations = {
				[path]: {
					terms: {
						field: path,
						order: 'count desc',
						size: 100
					}
				}
			};
			//log.info(toStr({aggregations}));

			const queryParams = {
				aggregations,
				count: 0,
				filters: filtersExceptCategory,
				query
			}; //log.info(toStr({queryParams}));

			const queryRes = cachedQuery({
				cache: queryCache,
				connection: multiRepoConnection,
				params: queryParams
			});
			//log.info(toStr({queryRes}));

			facets.forEach(({tag}, childIndex) => {
				//log.info(toStr({childIndex, path}));
				//log.info(toStr({buckets: queryRes.aggregations[path].buckets}));
				const filteredBuckets = queryRes.aggregations[path].buckets.filter(({key}) => key === tag);
				//log.info(toStr({filteredBuckets}));
				if (filteredBuckets.length) {
					firstPass[index].facets[childIndex].count = filteredBuckets[0].docCount;
				} else {
					firstPass[index].facets[childIndex].count = 0;
				}
				delete firstPass[index].facets[childIndex].tag;
			}); // facets.forEach
		} // if hasValuesInCategory
		delete firstPass[index].hasValuesInCategory;
	}); // firstPass.forEach

	return firstPass;
} // function buildFacets
