import set from 'set-value';

//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {dlv} from '/lib/util/object';


/*
	What is needed to build the facet filters?
	* facetParams to find which facets are selected
	* facetsObj to make sure only configured facets are applied
*/
export function buildFiltersFromParams({
	facetsObj,
	facetsParam,
	staticFilters
}) {
	//log.info(toStr({facetsObj, facetsParam, staticFilters}));
	const filters = JSON.parse(JSON.stringify(staticFilters)); // Deep clone // {...staticFilters} is shallow
	Object.keys(facetsParam).forEach((field) => {
		const tags = facetsParam[field];
		if (facetsObj[field]) {
			const values = [];
			if (tags) {
				forceArray(tags).forEach(tag => {
					if (facetsObj[field][tag]) {
						values.push(tag);
					}
				});
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
			}
		}
	});
	return filters;
} // buildFiltersFromParams
