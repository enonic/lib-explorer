import {toStr} from '/lib/util';
import {NT_THESAURUS} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
import {query as querySynonyms} from '/lib/explorer/synonym/query';


export function query({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	explain = false,
	logQuery = false,
	logQueryResults = false,
	filters = {},
	getSynonymsCount = true,
	query = '', //"_parentPath = '/thesauri'",
	sort = '_name ASC'
} = {}) {
	const queryThesauriParams = {
		count,
		explain,
		filters: addFilter({
			filters,
			filter: hasValue('type', [NT_THESAURUS])
		}),
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
	queryThesauriRes.hits = queryThesauriRes.hits.map((hit) => {
		const {
			_name: name,
			_path,
			description = '',
			displayName,
			type
		} = connection.get(hit.id);
		const rv = {
			_path,
			description,
			displayName,
			id: hit.id,
			name,
			type
		};
		if (getSynonymsCount) {
			const synonymsRes = querySynonyms({
				connection,
				count: 0,
				query: `_parentPath = '/thesauri/${name}'`
			});
			//log.info(toStr({synonymsRes}));
			rv.synonymsCount = synonymsRes.total;
		}
		return rv;
	});
	return queryThesauriRes;
} // function query
