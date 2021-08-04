//import {toStr} from '@enonic/js-utils';

import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {query} from '/lib/explorer/collection/query';
import {camelize} from '/lib/explorer/string/camelize';
import {
	GraphQLBoolean,
	newSchemaGenerator
} from '/lib/graphql';

const {
	createInputObjectType
} = newSchemaGenerator();


export function buildCollectionsArg() {
	const collectionsRes = query({
		connection: connect({ principals: [PRINCIPAL_EXPLORER_READ] }),
		count: -1
	});
	//log.info(`collectionsRes:${toStr(collectionsRes)}`);
	const fields = {};
	collectionsRes.hits.forEach(({_name}) => {
		fields[camelize(_name, /-/g)] = { type: GraphQLBoolean };
	});

	return createInputObjectType({
		name: 'SearchCollections',
		fields
	});
}
