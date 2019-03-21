export function addFilter({
	clause = 'must',
	filter,
	filters = {} // Reference which gets modified
}) {
	if (!filters.boolean) { filters.boolean = {}; }
	if (!filters.boolean[clause]) { filters.boolean[clause] = []; }
	if (!Array.isArray(filters.boolean[clause])) {
		filters.boolean[clause] = [filters.boolean[clause]];
	}
	filters.boolean[clause].push(filter);
	return filters;
}
