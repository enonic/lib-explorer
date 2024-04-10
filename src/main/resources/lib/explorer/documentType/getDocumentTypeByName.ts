import type {DocumentTypeNode} from '@enonic-types/lib-explorer';


import {connect} from '/lib/xp/node';
import {
	PRINCIPAL_EXPLORER_READ,
	REPO_ID_EXPLORER
} from '/lib/explorer/constants';
import {coerseDocumentType} from './coerseDocumentType';
import {documentTypeNameToPath} from './documentTypeNameToPath';


export function getDocumentTypeByName({
	documentTypeName
}: {
	documentTypeName: string
}) {
	const explorerReadConnection = connect({
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
