import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';

import {PRINCIPAL_YASE_READ, RT_JSON} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';
import {query as querySynonyms} from '/lib/enonic/yase/synonym/query';


export function get({
	params: {
		from,
		to,
		page = 1, // NOTE First index is 1 not 0
		perPage = 10,
		//query = '',
		//sort = 'from ASC',
		sort = '_score DESC',
		thesauri = ''
	} = {}
}) {
	const intPerPage = parseInt(perPage, 10);
	const intPage = parseInt(page, 10);
	const start = (intPage - 1 ) * intPerPage;

	const queries = [];
	if (from) {
		queries.push(`(fulltext('from^2', '${from}', 'AND') OR ngram('from^1', '${from}', 'AND'))`);
	}
	if (to) {
		queries.push(`(fulltext('to^2', '${to}', 'AND') OR ngram('to^1', '${to}', 'AND'))`);
	}
	const query = queries.length ? `(${queries.join(' OR ')})` : '';

	const filters = {};
	const thesauriArr = thesauri.split(',');
	if(thesauri) {
		thesauriArr.forEach(thesaurus => {
			addFilter({
				filters,
				filter: hasValue('_parentPath', `/thesauri/${thesaurus}`)
			});
		})
	}

	const connection = connect({
		principals: [PRINCIPAL_YASE_READ]
	});
	const count = intPerPage;
	const result = querySynonyms({
		connection,
		count,
		filters,
		query,
		sort,
		start
	});
	//log.info(toStr({result}));
	result.page = intPage;
	result.start = start + 1;
	result.end = Math.min(start + intPerPage, result.total);
	result.totalPages = Math.ceil(result.total / intPerPage);

	const aggregations = {
		thesaurus: {
			terms: {
				field: '_parentPath',
				order: '_count desc',
				size: 100
			}
		}
	};
	const thesauriAggRes = querySynonyms({
		connection,
		aggregations,
		count: 0,
		filters: {},
		query
	});
	result.aggregations.thesaurus = thesauriAggRes.aggregations.thesaurus;

	return {
		contentType: RT_JSON,
		body: {
			serviceParams: {
				from,
				page: intPage,
				perPage: intPerPage,
				sort
			},
			queryParams: {
				aggregations,
				count,
				filters,
				query,
				//sort,
				start
			},
			queryResult: result
		}
	};
}
