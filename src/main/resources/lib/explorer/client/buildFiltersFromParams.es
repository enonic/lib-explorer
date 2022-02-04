import {
	forceArray,
	getIn,
	setIn
	//toStr
} from '@enonic/js-utils';

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
					if (!getIn(filters, 'boolean.must')) {
						setIn(filters, 'boolean.must', []);
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
