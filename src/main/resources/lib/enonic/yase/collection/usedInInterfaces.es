import {queryInterfaces} from '/lib/enonic/yase/admin/interfaces/queryInterfaces';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';


export function usedInInterfaces({
	connection,
	name
}) {
	return queryInterfaces({
		connection,
		filters: addFilter({
			filter: hasValue('collections', name)
		})
	}).hits.map(({displayName}) => displayName);
}
