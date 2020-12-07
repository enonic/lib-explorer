import merge from 'deepmerge';
import Uri from 'jsuri';

//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {sanitize} from '/lib/xp/common';

import {hash} from '/lib/explorer/string/hash';

//const {currentTimeMillis} = Java.type('java.lang.System');


//──────────────────────────────────────────────────────────────────────────────
// Private function
//──────────────────────────────────────────────────────────────────────────────
function uriObjFromParams(params) {
	const uri = new Uri();
	Object.keys(params).forEach((k) => {
		const v = params[k];
		if(k === 'facets') {
			Object.keys(v).forEach((field) => {
				const tag = v[field];
				Array.isArray(tag)
					? tag.forEach(value => uri.addQueryParam(field, value))
					: tag && uri.addQueryParam(field, tag);
			});
		} else if (![
			'clearCache', // The enduser should not see this
			'count', // The enduser should not provide nor see this
			'explain', // The enduser should not see this
			'interface', // The enduser should not provide nor see this
			'locale', // The enduser should not see this
			'logQuery', // The enduser should not see this
			'logQueryResults', // The enduser should not see this
			'name', // The enduser should not provide nor see this
			'page', // Adding or removing a facet resets pagination
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
	aggregationsCacheObj,
	aggregations,
	facetConfig,
	filters,
	localizedFacets,
	multiRepoConnection,
	params,
	query//,
	//times
}) {
	if (!facetConfig) {
		return [];
	}
	//log.info(toStr({params, facetConfig}));
	const facetsObjWithChildBeeingArray = {};
	//log.info(toStr({facets: params.facets}));
	if (params.facets) {
		Object.keys(params.facets).forEach(field => {
			const value = params.facets[field];
			facetsObjWithChildBeeingArray[field] = value ? forceArray(value) : [];
		});
	}
	//log.info(toStr({facetsObjWithChildBeeingArray}));

	//──────────────────────────────────────────────────────────────────────────
	// First pass: Localize facetName, find active/inactive facets and build links.
	//──────────────────────────────────────────────────────────────────────────
	const firstPass = facetConfig.map(({tag: field, facets: children}) => {
		//log.info(toStr({field, children}));
		//const field = fieldPath.replace(/^\/fields\//, '');
		const fieldPath = `/fields/${field}`;
		let activeCount = 0;
		let inactiveCount = 0;

		const facetCategoryClearUri = uriObjFromParams(params);
		facetCategoryClearUri.deleteQueryParam(field); // Remove current field, but keep all the others
		//log.info(toStr({'facetCategoryClearUri': facetCategoryClearUri.toString(), field}));

		const facetCategoryUri = uriObjFromParams(params);
		facetCategoryUri.deleteQueryParam(field); // Remove current field, but keep all the others
		//log.info(toStr({'facetCategoryUri': facetCategoryUri.toString(), field}));

		const hasValuesInCategory = {};

		const facets = children.map(({tag: tagName}) => {
			//log.info(toStr({tagName}));
			//const tagName = tagPath.replace(`/fields/${field}/`, ''); //log.info(toStr({tagName}));
			const tagPath = `/fields/${field}/${tagName}`;
			facetCategoryUri.addQueryParam(field, tagName); // Add all tags in field

			const facetUri = uriObjFromParams(params);

			facetUri.deleteQueryParam(field, tagName); // Remove the current tag
			const removeHref = facetUri.toString() || '?';
			facetUri.addQueryParam(field, tagName); // Re-add the current tag

			const active = facetsObjWithChildBeeingArray[field] && facetsObjWithChildBeeingArray[field].includes(tagName);
			if (active) {
				activeCount += 1;
				if (hasValuesInCategory[field]) {
					hasValuesInCategory[field].push(tagName);
				} else {
					hasValuesInCategory[field] = [tagName];
				}
			} else {
				inactiveCount += 1;
			}
			return {
				active,
				//count, // Gets added in 2nd pass
				href: facetUri.toString(),
				name: localizedFacets[tagPath],
				removeHref,
				tag: tagName // Gets used and removed in 2nd pass
			};
		}); // children.map

		return {
			activeCount,
			clearHref: facetCategoryClearUri.toString() || '?',
			field, // Gets removed in 2nd pass
			hasValuesInCategory, // Gets removed in 2nd pass
			href: facetCategoryUri.toString(),
			inactiveCount,
			name: localizedFacets[fieldPath],
			facets
		}; // return
	}); //facetConfig.map
	//log.info(toStr({firstPass}));
	//times.push({label: 'first pass', time: currentTimeMillis()});

	//──────────────────────────────────────────────────────────────────────────
	// Second pass: Build and do aggregation queries and apply counts.
	//──────────────────────────────────────────────────────────────────────────
	firstPass.forEach(({facets, field, hasValuesInCategory}, index) => {
		const filtersExceptCategory = merge.all([{}, filters]);
		//log.info(toStr({filtersExceptCategory}));
		if (hasValuesInCategory) {
			Object.keys(hasValuesInCategory).forEach((path) => {
				const values = hasValuesInCategory[path];
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
											//log.info(toStr({boolean: filtersExceptCategory.boolean}));
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
			}); // keys hasValuesInCategory

			const queryParams = {
				aggregations,
				count: 0,
				//explain: true, // DEBUG
				filters: filtersExceptCategory,
				query
			}; //log.info(toStr({queryParams}));

			const aggregationCacheKey = hash(filtersExceptCategory, 52);
			/*if (aggregationsCacheObj[aggregationCacheKey]) {
				//log.info(`Using cached aggregation key:${aggregationCacheKey} filters:${toStr(filtersExceptCategory)}`);
				log.info(`Using cached aggregation key:${aggregationCacheKey}`);
			}*/
			const aggregationsRes = aggregationsCacheObj[aggregationCacheKey] || multiRepoConnection.query(queryParams).aggregations;
			//log.info(toStr({aggregationsRes}));
			//times.push({label: 'second pass agg query', time: currentTimeMillis()});

			//log.info(toStr({facets}));
			facets.forEach(({tag}, childIndex) => {
				//log.info(toStr({tag, childIndex, field}));
				//const field = tag.replace(/^\/tags\//, '').replace(/\/.*$/, '');
				//log.info(toStr({buckets: aggregationsRes[field].buckets}));
				const filteredBuckets = aggregationsRes[field].buckets.filter(({key}) => sanitize(key) === tag);
				//log.info(toStr({filteredBuckets}));
				if (filteredBuckets.length) {
					//log.info(toStr({[`firstPass[${index}]`]: firstPass[index]}));
					firstPass[index].facets[childIndex].count = filteredBuckets[0].docCount;
				} else {
					firstPass[index].facets[childIndex].count = 0;
				}
				//delete firstPass[index].facets[childIndex].tag;
			}); // facets.forEach
		} // if hasValuesInCategory
		//delete firstPass[index].field;
		delete firstPass[index].hasValuesInCategory;
		//times.push({label: 'second pass loop end', time: currentTimeMillis()});
	}); // firstPass.forEach
	//times.push({label: 'second pass after loop', time: currentTimeMillis()});

	return firstPass;
} // function buildFacets
