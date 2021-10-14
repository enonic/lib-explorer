import {
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';

import {coerseDocumentType} from './coerseDocumentType';


export function getDocumentType({
	_id,
	connection = connect({ principals: [PRINCIPAL_EXPLORER_READ] })
}) {
	const documentTypeNode = connection.get(_id);
	if (documentTypeNode) {
		return coerseDocumentType(documentTypeNode);
	}
	throw new Error(`Unable to get documentType with _id:${_id}!`);
}
