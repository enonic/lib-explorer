import type {
	BooleanFilter,
	Filter,
} from '/lib/xp/node';


export function addFilter({
	clause = 'must',
	filter,
	filters = {} // Reference which gets modified
} :{
	clause?: 'must'|'mustNot'|'should'
	filter: Filter
	filters?: {
		boolean? :BooleanFilter['boolean']
	}
}) {
	log.warning('/lib/explorer/query/addFilter is DEPRECATED, use @enonic/js-utils addQueryFilter instead!');
	if (!filters.boolean) { filters.boolean = {}; }
	if (!filters.boolean[clause]) { filters.boolean[clause] = []; }
	if (!Array.isArray(filters.boolean[clause])) {
		filters.boolean[clause] = [filters.boolean[clause] as Filter];
	}
	(filters.boolean[clause] as Array<Filter>).push(filter);
	return filters;
}
