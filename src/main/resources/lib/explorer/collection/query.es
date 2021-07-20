import {
	addQueryFilter,
	isNotSet,
	isSet//,
	//toStr
} from '@enonic/js-utils';

import {NT_COLLECTION} from '/lib/explorer/model/2/constants';
import {hasValue} from '/lib/explorer/query/hasValue';


export function query({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count,// = -1, // This is almost the same as perPage.
	filters = {},
	query = '', //"_parentPath = '/collections'",
	page,// = 1, // NOTE First index is 1 not 0
	perPage = 10, // This is almost the same as count.
	sort = '_name ASC',
	start = 0
} = {}) {
	//log.info(toStr({count,page,perPage,sort,start}));
	// When neither count nor page is passed: count=-1 page=null
	// When both count and page is passed: count=-1 page=null
	// When only count is passed: page=null
	// When only page is passed: count=perPage
	// Summary: Count rules
	let intPerPage;
	let intPage;
	if (isNotSet(count)) {
		if(isSet(page)) {
			intPerPage = parseInt(perPage, 10);
			count = intPerPage;
			intPage = parseInt(page, 10);
			start = (intPage - 1 ) * intPerPage;
		} else {
			count=-1;
		}
	}
	//log.info(toStr({count,sort,start}));

	const queryParams = {
		count,
		filters: addQueryFilter({
			filter: hasValue('_nodeType', [NT_COLLECTION]),
			filters
		}),
		query,
		sort,
		start
	};
	//log.debug(`queryParams:${toStr(queryParams)}`);

	const queryRes = connection.query(queryParams);
	if(isSet(intPage)) {
		queryRes.page = intPage;
		queryRes.pageStart = start + 1;
		queryRes.pageEnd = Math.min(start + intPerPage, queryRes.total);
		queryRes.pagesTotal = Math.ceil(queryRes.total / intPerPage);
	}
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	return queryRes;
}
