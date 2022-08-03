import type {
	QueryDSL,
	SortDSLExpression
} from '@enonic/js-utils/src/types';
//import type {Aggregations} from '@enonic/js-utils/src/types/node/query/Aggregation.d';
import type {
	//Highlight,
	QueryFilters,
	RepoConnection
} from '/lib/explorer/types/index.d';


import {addQueryFilter} from '@enonic/js-utils';
import {hasValue} from '/lib/explorer/query/hasValue';


export function query({
	// Required
	connection,
	// Optional
	//aggregations,
	count = -1,
	filters = {},
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
	connection :RepoConnection
	// Optional
	//aggregations ?:Aggregations<AggregationKeys>
	count ?:number
	filters ?:QueryFilters
	//highlight ?:Highlight
	nodeTypes ?:Array<string>
	parentPaths ?:Array<string>
	query ?:QueryDSL|string
	sort ?:SortDSLExpression|string
	start ?:number
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
	return connection.query<{
		id :string
		score :number
	}>({
		//aggregations,
		count,
		filters,
		//highlight,
		query: queryArg,
		sort,
		start
	});
}
