import type {RepoConnection} from '/lib/explorer/types/index.d';

import {
	addQueryFilter/*,
	toStr*/
} from '@enonic/js-utils';
import {coerseDocumentType} from '/lib/explorer/documentType/coerseDocumentType';
import {NT_DOCUMENT_TYPE} from '/lib/explorer/documentType/constants';
import {hasValue} from '/lib/explorer/query/hasValue';


export function queryDocumentTypes({
	readConnection
} :{
	readConnection :RepoConnection
}) {
	const qr = readConnection.query({
		count: -1,
		filters: addQueryFilter({
			filter: hasValue('_nodeType', [NT_DOCUMENT_TYPE])
		}),
		query: ''
	});
	const rv = {
		count: qr.count,
		total: qr.count,
		hits: qr.hits.map(({id}) => coerseDocumentType(readConnection.get(id))),
	};
	return rv;
}
