import {query} from '/lib/enonic/yase/interface/query';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';


export function usedInInterfaces({
	connection,
	name
}) {
	return query({
		connection,
		filters: addFilter({
			filter: hasValue('collections', name)
		})
	}).hits.map(({displayName}) => displayName);
}
