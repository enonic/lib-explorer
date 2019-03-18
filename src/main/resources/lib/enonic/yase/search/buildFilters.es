import {forceArray} from '/lib/enonic/util/data';


function buildFilter({
	filter,
	field,
	values
}) {
	const aFilter = {};
	switch (filter) {
	case 'exists':
	case 'notExists': return field ? {[filter]: {field}} : null;
	case 'hasValue': return (field && values && values.length)
		? {[filter]: {field, values}}
		: null;
	case 'ids': return values && values.length ? {[filter]: {values}} : null;
	default: return null
	}
}


export function buildFilters(config) {
	const filters = {
		boolean: {
			mustNot: [{
				hasValue: { // Avoid root node whoos _path is '/'
					field: '_path',
					values: ['/']
				}
				/*hasValue: { // Avoid root node which has an empty name
					field: '_name',
					values: ['']
				}*/
			}]
		}
	};
	if (!config) { return filters; }

	['must', 'mustNot'].forEach(clause => {
		if(config[clause]) {
			forceArray(config[clause]).forEach(({
				filter,
				params: {
					field,
					values
				}
			}) => {
				const aFilter = buildFilter({
					filter,
					field,
					values
				});
				if (aFilter) {
					if (!filters.boolean[clause]) {
						filters.boolean[clause] = [];
					}
					filters.boolean[clause].push(aFilter);
				}
			});
		}
	});
	return filters;
} // buildFilters
