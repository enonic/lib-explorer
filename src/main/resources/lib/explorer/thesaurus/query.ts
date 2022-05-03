import type {
	QueryFilters,
	RepoConnection
} from '/lib/explorer/types.d';
import type {
	Thesaurus,
	ThesaurusNode
} from './types.d';

import {
	forceArray,
	toStr
} from '@enonic/js-utils';

import {NT_THESAURUS} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
import {query as querySynonyms} from '/lib/explorer/synonym/query';


export function query({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	explain = false,
	filters = {},
	getSynonymsCount = true,
	logQuery = false,
	logQueryResults = false,
	query = '', //"_parentPath = '/thesauri'",
	sort = '_name ASC',
	thesauri
} :{
	connection :RepoConnection
	count? :number
	explain? :boolean
	filters? :QueryFilters
	getSynonymsCount? :boolean
	logQuery? :boolean
	logQueryResults? :boolean
	query? :string
	sort? :string
	thesauri? :string
}) {
	addFilter({
		filter: hasValue('_nodeType', [NT_THESAURUS]),
		filters
	});
	if (thesauri) {
		const thesauriArr = forceArray(thesauri);
		if (thesauriArr.length) {
			addFilter({
				filters,
				filter: hasValue('_name', thesauriArr)
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
			const {
				_name,
				_nodeType,
				_path,
				_versionKey,
				description = '',
				language
			} = connection.get(hit.id) as ThesaurusNode;
			const rv :Thesaurus = {
				_id: hit.id,
				_name,
				_nodeType,
				_path,
				_versionKey,
				description,
				id: hit.id, // backwards compatibility
				language,
				name: _name // backwards compatibility
			};
			if (getSynonymsCount) {
				const synonymsRes = querySynonyms({
					connection,
					count: 0,
					query: `_parentPath = '/thesauri/${_name}'`
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
