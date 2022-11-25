import type {
	QueryNodeParams,
	RepoConnection,
} from '/lib/xp/node';
//import type {Aggregations} from '@enonic/js-utils/src/types/node/query/Aggregation.d';


import {addQueryFilter} from '@enonic/js-utils';
import {hasValue} from '/lib/explorer/query/hasValue';


export function query/*<
	AggregationKey extends undefined|string = undefined
>*/({
	// Required
	connection,
	// Optional
	//aggregations,
	count = -1,
	filters,
	//highlight,
	nodeTypes = [],
	parentPaths = [],
	query: queryArg,
	sort = {
		field: '_path',
		direction: 'ASC'
	},
	start
} :{
	// Required
	connection: RepoConnection
	// Optional
	//aggregations ?:Aggregations<AggregationKeys>
	count?: QueryNodeParams['count']
	filters?: QueryNodeParams['filters']
	//highlight ?:Highlight
	nodeTypes?: string[]
	parentPaths?: string[]
	query?: QueryNodeParams['query']
	sort?: QueryNodeParams['sort']
	start?: QueryNodeParams['start']
}) {
	if (nodeTypes.length) {
		filters = addQueryFilter({
			filter: hasValue('_nodeType', nodeTypes),
			filters
		});
	}
	if (parentPaths.length) {
		filters = addQueryFilter({
			filter: hasValue('_parentPath', parentPaths),
			filters
		});
	}
	return connection.query/*<AggregationKey>*/({
		//aggregations,
		count,
		filters,
		//highlight,
		query: queryArg,
		sort,
		start
	});
}
