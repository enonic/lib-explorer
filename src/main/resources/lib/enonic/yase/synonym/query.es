//import {toStr} from '/lib/enonic/util';
import {NT_SYNONYM} from '/lib/enonic/yase/constants';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';


export function query({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	count = -1,
	filters = {},
	query = '',
	sort = '_name ASC'
} = {}) {
	filters = addFilter({
		filters,
		filter: hasValue('type', [NT_SYNONYM])
	});
	const queryParams = {
		/*aggregations: {
			_parentPath: {
				terms: {
					field: '_parentPath', // Doesn't exist by default in the node layer :(
					order: '_count desc',
					size: 100
				}
			}
		},*/
		count,
		filters,
		query,
		sort
	};
	//log.info(toStr({queryParams}));
	const queryRes = connection.query(queryParams);
	//log.info(toStr({queryRes}));
	queryRes.hits = queryRes.hits.map((hit) => {
		const {
			_name,
			_path,
			displayName,
			from,
			to
		} = connection.get(hit.id);
		return {
			displayName,
			from,
			id: hit.id,
			name: _name,
			thesaurus: _path.match(/[^/]+/g)[1],
			score: hit.score,
			to
		};
	});
	return queryRes;
} // function query
