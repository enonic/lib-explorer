import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';

import {NT_DOCUMENT} from '/lib/explorer/model/2/constants';


function buildFilter({
	filter,
	field,
	values
}) {
	//const aFilter = {};
	switch (filter) {
	case 'exists':
	case 'notExists': return field ? {[filter]: {field}} : null;
	case 'hasValue': return (field && values && values.length)
		? {[filter]: {field, values}}
		: null;
	case 'ids': return values && values.length ? {[filter]: {values}} : null;
	default: return null;
	}
}


export function buildStaticFiltersFromInterface(filtersConfig) {
	const filters = {
		boolean: {
			must: [{
				hasValue: {
					field: '_nodeType',
					values: [NT_DOCUMENT]
				}
			}],
			mustNot: [{
				hasValue: { // Avoid root node whoos _path is '/'
					field: '_path',
					values: ['/']
				}
			}/*, {
				hasValue: { // Avoid root node which has an empty name
					field: '_name',
					values: ['']
				}
			}*/]
		}
	};
	if (!filtersConfig) { return filters; }

	[
		'must',
		'mustNot',
		'should'
	].forEach(clause => {
		if(filtersConfig[clause]) {
			forceArray(filtersConfig[clause]).forEach(({
				filter,
				params: {
					field,
					values
				}
			}) => {
				const aFilter = buildFilter({
					filter,
					field,
					values: values && forceArray(values)
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
	//log.info(toStr({filters}));
	return filters;
} // buildStaticFiltersFromInterface
