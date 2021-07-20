//import {toStr} from '@enonic/js-utils';

//import {newCache} from '/lib/cache';
import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {query} from '/lib/explorer/stopWords/query';
//import {camelize} from '/lib/explorer/string/camelize';
import {
	createInputObjectType,
	GraphQLBoolean//,
	//GraphQLInt
} from '/lib/graphql';


export function buildStopwordsArg() {
	const stopwordsRes = query({
		connection: connect({ principals: [PRINCIPAL_EXPLORER_READ] })
	});
	//log.info(`stopwordsRes:${toStr(stopwordsRes)}`);
	const fields = {};
	stopwordsRes.hits.forEach(({name}) => {
		fields[name] = { type: GraphQLBoolean };
	});
	return createInputObjectType({
		name: 'SearchStopwordsArg',
		fields
	});
} // buildStopwordsArg
