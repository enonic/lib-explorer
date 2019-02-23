//──────────────────────────────────────────────────────────────────────────────
// Node modules (webpacked)
//──────────────────────────────────────────────────────────────────────────────
import Uri from 'jsuri';


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
	params,
	localizedFacets
}) {
	const rv = facetConfig.map(({tag, facets: children}) => {
		let activeCount = 0;
		let inactiveCount = 0;
		const facetCategoryUri = uriObjFromParams(params);
		const facetCategoryClearUri = uriObjFromParams(params);

		const facets = children.map(({tag: facetTag}) => {
			const facetUri = uriObjFromParams(params);
			const active = !!params.facets && params.facets.includes(facetTag);

			facetUri.deleteQueryParam('facets', facetTag);
			const removeHref = facetUri.toString();
			facetUri.addQueryParam('facets', facetTag);

			facetCategoryUri.deleteQueryParam('facets', facetTag); // Avoid duplication
			facetCategoryUri.addQueryParam('facets', facetTag);
			facetCategoryClearUri.deleteQueryParam('facets', facetTag);

			if (active) {
				activeCount += 1;
				//log.info(`facetId:${facetId} is active with path:${path} value:${value}`);
				/*if (hasValuesInCategory[path]) {
					hasValuesInCategory[path].push(value);
				} else {
					hasValuesInCategory[path] = [value];
				}
				if (hasValues[path]) {
					hasValues[path].push(value);
				} else {
					hasValues[path] = [value];
				}*/
			} else {
				inactiveCount += 1;
			}
			return {
				active,
				//count,
				href: facetUri.toString(),
				name: localizedFacets[facetTag],
				removeHref
			};
		});

		return {
			activeCount,
			clearHref: facetCategoryClearUri.toString(),
			href: facetCategoryUri.toString(),
			inactiveCount,
			name: localizedFacets[tag],
			facets
		}; // return
	}); //facetConfig.map
	return rv;
} // function buildFacets
