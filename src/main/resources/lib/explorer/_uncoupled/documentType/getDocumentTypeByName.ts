import type {DocumentTypeNode} from '/lib/explorer/types/index.d';
import type {JavaBridge} from '../../_coupling/types.d';


import {
	PRINCIPAL_EXPLORER_READ,
	REPO_ID_EXPLORER
} from '../../constants';
import {coerseDocumentType} from './coerseDocumentType';
import {documentTypeNameToPath} from './documentTypeNameToPath';


export function getDocumentTypeByName({
	documentTypeName
} :{
	documentTypeName :string
}, javaBridge :JavaBridge) {
	const explorerReadConnection = javaBridge.connect({
		branch: 'master',
		principals: [PRINCIPAL_EXPLORER_READ],
		repoId: REPO_ID_EXPLORER
	});
	const path = documentTypeNameToPath(documentTypeName);
	const documentTypeNode = explorerReadConnection.get(path) as DocumentTypeNode;
	if (!documentTypeNode) {
		throw new Error(`Unable to get documentType with name:${documentTypeName}!`);
	}
	return coerseDocumentType(documentTypeNode);
}
