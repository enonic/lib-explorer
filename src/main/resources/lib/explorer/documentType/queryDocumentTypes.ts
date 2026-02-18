import type {
	QueryDSL,
	SortDSLExpression
} from '@enonic/js-utils/types';
//import type {Aggregations} from '@enonic/js-utils/types/node/query/Aggregation.d';
import type {
	//Highlight,
	QueryFilters,
	RepoConnection
} from '../types.d';


//import {toStr} from '@enonic/js-utils';
import {coerseDocumentType} from '/lib/explorer/documentType/coerseDocumentType';
import {NT_DOCUMENT_TYPE} from '/lib/explorer/documentType/constants';
import {query} from '/lib/explorer/node/query';


export function queryDocumentTypes({
	// Required
	readConnection,
	// Optional
	//aggregations,
	count = -1,
	filters = {} as QueryFilters,
	//highlight,
	query: queryArg,
	sort = {
		field: '_name',
		direction: 'ASC'
	},
	start
}: {
	// Required
	readConnection: RepoConnection
	// Optional
	//aggregations?: Aggregations<AggregationKeys>
	count?: number
	filters?: QueryFilters
	//highlight?: Highlight
	query?: QueryDSL|string,
	sort?: SortDSLExpression|string
	start?: number
}) {
	const qr = query({
		connection: readConnection,
		count,
		filters,
		nodeTypes: [NT_DOCUMENT_TYPE],
		query: queryArg,
		sort,
		start
	});
	const rv = {
		count: qr.count,
		total: qr.count,
		hits: qr.hits.map(({id}) => coerseDocumentType(readConnection.get(id))),
	};
	return rv;
}
