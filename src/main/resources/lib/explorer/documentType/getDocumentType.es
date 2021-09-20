import {
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';

import {coerseDocumentType} from './coerseDocumentType';


export function getDocumentType({
	_id,
	connection = connect({ principals: [PRINCIPAL_EXPLORER_READ] })
}) {
	return coerseDocumentType(connection.get(_id));
}
