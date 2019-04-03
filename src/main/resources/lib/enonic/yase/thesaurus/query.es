//import {toStr} from '/lib/enonic/util';
import {NT_THESAURUS} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';
import {query as querySynonyms} from '/lib/enonic/yase/synonym/query';


export function query({
	connection = connect(),
	count = -1,
	filters = {},
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
		const {_name: name, description = '', displayName} = connection.get(hit.id);
		const synonymsRes = querySynonyms({
			count: 0,
			query: `_parentPath = '/thesauri/${name}'`
		});
		//log.info(toStr({synonymsRes}));
		return {description, displayName, name, synonymsCount: synonymsRes.total};
	});
	return queryRes;
} // function query
