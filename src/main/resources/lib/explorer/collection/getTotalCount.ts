import {addQueryFilter} from '@enonic/js-utils';
import {
	NT_COLLECTION,
	PATH_COLLECTIONS
} from '/lib/explorer/constants';
import {hasValue} from '/lib/explorer/query/hasValue';


export const getTotalCount = ({
	connection // Connecting many places leeds to loss of control over principals, so pass a connection around
}) => {
	const {total} = connection.query({
		count: 0,
		filters: addQueryFilter({
			filter: hasValue('_nodeType', [NT_COLLECTION])
		}),
		query: `_parentPath = '${PATH_COLLECTIONS}'`
	});
	return total;
};
