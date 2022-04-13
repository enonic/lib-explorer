import type {RepoConnection} from '/lib/explorer/types.d';

import {addQueryFilter} from '@enonic/js-utils';
import {NT_COLLECTION} from '/lib/explorer/constants';
import {hasValue} from '/lib/explorer/query/hasValue';


export function getCollectionIds({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
} :{
	connection :RepoConnection
}) {
	const queryRes = connection.query({
		count: -1,
		filters: addQueryFilter({
			clause: 'must',
			filter: hasValue('_nodeType', [NT_COLLECTION])
		}),
		query: ''
	});
	return queryRes.hits.map(({id}) => id);
}
