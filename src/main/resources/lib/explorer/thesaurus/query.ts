import type {
	QueryNodeParams,
	RepoConnection,
} from '/lib/xp/node';


import {
	addQueryFilter,
	forceArray,
	toStr
} from '@enonic/js-utils';
import {
	FOLDER_THESAURI,
	NT_THESAURUS
} from '/lib/explorer/constants';
import {hasValue} from '/lib/explorer/query/hasValue';
import {query as querySynonyms} from '/lib/explorer/synonym/query';
import {coerceThesaurus} from '/lib/explorer/thesaurus/coerceThesaurus';


export function query({
	// Required
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	// Optional
	count = -1,
	explain = false,
	filters,
	getSynonymsCount = true,
	logQuery = false,
	logQueryResults = false,
	query = '', //"_parentPath = '/thesauri'",
	sort = '_name ASC',
	thesauri
} :{
	// Required
	connection: RepoConnection
	// Optional
	count?: QueryNodeParams['count']
	explain?: QueryNodeParams['explain']
	filters?: QueryNodeParams['filters']
	getSynonymsCount?: boolean
	logQuery?: boolean
	logQueryResults?: boolean
	query?: string
	sort?: string
	thesauri ?:string|Array<string>
}) {
	filters = addQueryFilter({
		filter: hasValue('_nodeType', [NT_THESAURUS]),
		filters
	});
	if (thesauri) {
		const thesauriArr = forceArray(thesauri);
		if (thesauriArr.length) {
			filters = addQueryFilter({
				//clause: 'should', // Must clause works, the _name field simply needs to match one of the values in the array, not all of them :)
				filter: hasValue('_name', thesauriArr),
				filters
				//filter: hasValue('_parentPath', thesauriArr.map(n => `/thesauri/${n}`))
			});
		}
	}
	//log.info(`filters:${toStr(filters)}`);
	const queryThesauriParams = {
		count,
		explain,
		filters,
		query,
		sort
	};
	if (logQuery) {
		log.info(`queryThesauriParams:${toStr(queryThesauriParams)}`);
	}
	const queryThesauriRes = connection.query(queryThesauriParams);
	if (logQueryResults) {
		log.info(`queryThesauriRes:${toStr(queryThesauriRes)}`);
	}

	const thesaurusQueryRes = {
		count: queryThesauriRes.count,
		hits: queryThesauriRes.hits.map((hit) => {
			const rv = coerceThesaurus(connection.get(hit.id));
			const {_name} = rv;
			if (getSynonymsCount) {
				const synonymsRes = querySynonyms({
					connection,
					count: 0,
					query: `_parentPath = '/${FOLDER_THESAURI}/${_name}'`
				});
				//log.info(toStr({synonymsRes}));
				rv.synonymsCount = synonymsRes.total;
			}
			return rv;
		}),
		total: queryThesauriRes.total,
	};
	return thesaurusQueryRes;
} // function query
