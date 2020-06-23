//import {toStr} from '/lib/util';
import {NT_THESAURUS} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
import {query as querySynonyms} from '/lib/explorer/synonym/query';


export function query({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {},
	getSynonymsCount = true,
	query = '', //"_parentPath = '/thesauri'",
	sort = '_name ASC'
} = {}) {
	const queryParams = {
		count,
		filters: addFilter({
			filters,
			filter: hasValue('type', [NT_THESAURUS])
		}),
		query,
		sort
	};
	const queryRes = connection.query(queryParams);
	queryRes.hits = queryRes.hits.map((hit) => {
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
	return queryRes;
} // function query
