import {NT_FIELD_VALUE} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';


export function getFieldValues({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	field,
	filters = {},
	sort = '_name ASC'
} = {}) {
	addFilter({
		clause: 'should',
		filter: hasValue('_nodeType', NT_FIELD_VALUE),
		filters
	});
	addFilter({
		clause: 'should',
		filter: hasValue('type', NT_FIELD_VALUE),
		filters
	});
	if (field) {
		addFilter({
			filter: hasValue('_parentPath', forceArray(field).map(f => `/fields/${f}`)),
			filters // reference gets modified
		});
	}
	//log.info(`filters:${toStr(filters)}`);
	const queryParams = {
		count: -1,
		filters,
		query: '',
		sort
	};
	const queryRes = connection.query(queryParams);
	//log.info(`queryRes:${toStr(queryRes)}`);
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	return queryRes;
}
