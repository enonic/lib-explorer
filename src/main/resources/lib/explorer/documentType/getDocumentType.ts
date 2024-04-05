import type {
	DocumentTypeNode,
	RepoConnection
} from '/lib/explorer/types/index.d';


import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {coerseDocumentType} from '/lib/explorer/documentType/coerseDocumentType';


export function getDocumentType({
	_id,
	connection = connect({ principals: [PRINCIPAL_EXPLORER_READ] })
}: {
	_id: string
	connection?: RepoConnection
}) {
	const documentTypeNode = connection.get(_id) as DocumentTypeNode;
	if (!documentTypeNode) {
		throw new Error(`Unable to get documentType with _id:${_id}!`);
	}
	return coerseDocumentType(documentTypeNode);
}
