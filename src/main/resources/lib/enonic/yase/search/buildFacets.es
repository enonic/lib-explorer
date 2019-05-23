//──────────────────────────────────────────────────────────────────────────────
// Node modules (webpacked)
//──────────────────────────────────────────────────────────────────────────────
import merge from 'deepmerge';
import Uri from 'jsuri';
import set from 'set-value';


//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {dlv} from '/lib/util/object';
import {sanitize} from '/lib/xp/common';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {cachedQuery} from '/lib/enonic/yase/search/cachedQuery';


//──────────────────────────────────────────────────────────────────────────────
// Private function
//──────────────────────────────────────────────────────────────────────────────
function uriObjFromParams(params) {
	const uri = new Uri();
	Object.entries(params).forEach(([k, v]) => {
		if(k === 'facets') {
			Object.entries(v).forEach(([field, tag]) => {
				Array.isArray(tag)
				 ? tag.forEach(value => uri.addQueryParam(field, value))
				 : tag && uri.addQueryParam(field, tag)
			});
		} else if (![
			'clearCache', // The enduser should not see this
			'count', // The enduser should not provide nor see this
			'interface', // The enduser should not provide nor see this
			'locale', // The enduser should not see this
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
	facetConfig,
	filters = {},
	localizedFacets,
	multiRepoConnection,
	params,
	queriesObj,
	query
}) {
	//log.info(toStr({params}));
	const hasValues = {}; // Built in 1st pass, used in 2nd pass.
	const facetsObjWithChildBeeingArray = {};
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
			//const tagName = tagPath.replace(`/fields/${field}/`, ''); //log.info(toStr({tagName}));
			const tagPath = `/fields/${field}/${tagName}`;
			facetCategoryUri.addQueryParam(field, tagName); // Add all tags in field

			const facetUri = uriObjFromParams(params);

			facetUri.deleteQueryParam(field, tagName); // Remove the current tag
			const removeHref = facetUri.toString() || '?';
			facetUri.addQueryParam(field, tagName); // Re-add the current tag

			const active = facetsObjWithChildBeeingArray[field] && facetsObjWithChildBeeingArray[field].includes(tagName);
			if (active) {
				activeCount += 1;
				if (hasValuesInCategory[field]) {
					hasValuesInCategory[field].push(tagName);
				} else {
					hasValuesInCategory[field] = [tagName];
				}
				if (hasValues[field]) {
					hasValues[field].push(tagName);
				} else {
					hasValues[field] = [tagName];
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
			clearHref: facetCategoryClearUri.toString() || '?',
			field, // Gets removed in 2nd pass
			hasValuesInCategory, // Gets removed in 2nd pass
			href: facetCategoryUri.toString(),
			inactiveCount,
			name: localizedFacets[fieldPath],
			facets
		}; // return
	}); //facetConfig.map
	//log.info(toStr({firstPass}));

	//──────────────────────────────────────────────────────────────────────────
	// Modify base filter
	//──────────────────────────────────────────────────────────────────────────
	//log.info(toStr({hasValues}));
	const hasValueEntries = Object.entries(hasValues); //log.info(toStr({hasValueEntries}));
	if (hasValueEntries.length && !dlv(filters, 'boolean.must')) {
		set(filters, 'boolean.must', []);
	}
	hasValueEntries.forEach(([field, values]) => {
		//log.info(toStr({field, values}));
		//if (values.length) {
		/*if (!dlv(filters, 'boolean.must')) {
			set(filters, 'boolean.must', []);
		}*/
		filters.boolean.must.push({
			hasValue: {
				field,
				values
			}
		});
		//}
	});
	//log.info(toStr({filters}));

	//──────────────────────────────────────────────────────────────────────────
	// Second pass: Build and do aggregation queries and apply counts.
	//──────────────────────────────────────────────────────────────────────────
	firstPass.forEach(({facets, field, hasValuesInCategory}, index) => {
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

			const aggregations = {};
			aggregations[field] = {
				terms: {
					field: field,
					order: 'count desc', // '_term asc'
					size: 100
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
				connection: multiRepoConnection,
				params: queryParams,
				queriesObj
			});
			//log.info(toStr({queryRes}));

			//log.info(toStr({facets}));
			facets.forEach(({tag}, childIndex) => {
				//log.info(toStr({tag, childIndex, field}));
				//const field = tag.replace(/^\/tags\//, '').replace(/\/.*$/, '');
				//log.info(toStr({buckets: queryRes.aggregations[field].buckets}));
				const filteredBuckets = queryRes.aggregations[field].buckets.filter(({key}) => sanitize(key) === tag);
				//log.info(toStr({filteredBuckets}));
				if (filteredBuckets.length) {
					//log.info(toStr({[`firstPass[${index}]`]: firstPass[index]}));
					firstPass[index].facets[childIndex].count = filteredBuckets[0].docCount;
				} else {
					firstPass[index].facets[childIndex].count = 0;
				}
				delete firstPass[index].facets[childIndex].tag;
			}); // facets.forEach
		} // if hasValuesInCategory
		delete firstPass[index].field;
		delete firstPass[index].hasValuesInCategory;
	}); // firstPass.forEach

	return firstPass;
} // function buildFacets
