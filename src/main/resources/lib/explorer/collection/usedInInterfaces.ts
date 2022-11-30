import {
	addQueryFilter,
	// toStr
} from '@enonic/js-utils';

import {query} from '/lib/explorer/interface/query';
import {hasValue} from '/lib/explorer/query/hasValue';


export function usedInInterfaces({
	connection,
	name
}) {
	const res = query({
		connection,
		filters: addQueryFilter({
			filter: hasValue('collections', name)
		})
	});
	//log.info(toStr({res}));
	const rv = res.hits.map(({_name}) => _name);
	//log.info(toStr({rv}));
	return rv;
}
