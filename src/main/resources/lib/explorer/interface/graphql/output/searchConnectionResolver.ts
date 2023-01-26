import type { SearchConnectionResolverEnv } from '/lib/explorer/interface/graphql/output/index.d';


import {
	decodeCursor//,
	//encodeCursor // Just use to generate after for testing
	//@ts-ignore
} from '/lib/graphql-connection';
import {searchResolver} from '/lib/explorer/interface/graphql/output/searchResolver';


export function searchConnectionResolver(env: SearchConnectionResolverEnv) {
	//log.debug(`env:${toStr({env})}`);
	const {
		after,// = encodeCursor('0'), // encoded representation of start
		aggregations,
		filters,
		first = 10, // count
		highlight,
		languages,
		profiling,
		searchString//,
		//synonyms
	} = env.args;
	//log.debug('after:%s', toStr(after));
	//log.debug('first:%s', toStr(first));
	//log.debug("encodeCursor('0'):%s", toStr(encodeCursor('0'))); // MA==
	//log.debug("encodeCursor('1'):%s", toStr(encodeCursor('1'))); // MQ==
	//log.debug("encodeCursor('2'):%s", toStr(encodeCursor('2'))); // Mg==

	const start = after ? parseInt(decodeCursor(after)) + 1 : 0;
	//log.debug('start:%s', toStr(start));

	const res = searchResolver({
		args: {
			aggregations,
			count: first,
			filters,
			highlight,
			languages,
			profiling,
			searchString,
			start//,
			//synonyms
		},
		context: env.context,
		source: env.source
	});
	return res;
}
