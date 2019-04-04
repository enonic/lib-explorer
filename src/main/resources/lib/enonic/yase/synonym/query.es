//import {toStr} from '/lib/enonic/util';
import {NT_SYNONYM} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';


export function query({
	connection = connect(),
	count = -1,
	filters = {},
	//name,
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
		query,//: `_parentPath = '/thesauri/${name}'`,
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
			to
		};
	});
	return queryRes;
} // function query
