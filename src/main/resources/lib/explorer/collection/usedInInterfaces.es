//import {toStr} from '/lib/util';

import {query} from '/lib/explorer/interface/query';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';


export function usedInInterfaces({
	connection,
	name
}) {
	const res = query({
		connection,
		filters: addFilter({
			filter: hasValue('collections', name)
		})
	});
	//log.info(toStr({res}));
	const rv = res.hits.map(({displayName}) => displayName);
	//log.info(toStr({rv}));
	return rv;
}
