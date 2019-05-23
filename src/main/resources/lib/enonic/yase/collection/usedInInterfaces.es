//import {toStr} from '/lib/util';

import {query} from '/lib/enonic/yase/interface/query';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';


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
