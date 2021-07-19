import {
	NT_COLLECTOR/*,
	PATH_COLLECTORS*/
} from '/lib/explorer/model/2/constants';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';


export const getTotalCount = ({
	connection // Connecting many places leeds to loss of control over principals, so pass a connection around
}) => {
	const {total} = connection.query({
		count: 0,
		filters: addFilter({
			filter: hasValue('_nodeType', [NT_COLLECTOR])
		}),
		query: "_parentPath = '/collectors'"
	});
	return total;
};
