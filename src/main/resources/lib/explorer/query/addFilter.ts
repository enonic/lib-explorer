export function addFilter<Filter>({
	clause = 'must',
	filter,
	filters = {} // Reference which gets modified
} :{
	clause? :'must'|'mustNot'|'should'
	filter :Filter
	filters? :{
		boolean? :{
			must? :Filter | Array<Filter>
			mustNot? :Filter | Array<Filter>
			should? :Filter | Array<Filter>
		}
	}
}) {
	if (!filters.boolean) { filters.boolean = {}; }
	if (!filters.boolean[clause]) { filters.boolean[clause] = []; }
	if (!Array.isArray(filters.boolean[clause])) {
		filters.boolean[clause] = [filters.boolean[clause] as Filter];
	}
	(filters.boolean[clause] as Array<Filter>).push(filter);
	return filters;
}
