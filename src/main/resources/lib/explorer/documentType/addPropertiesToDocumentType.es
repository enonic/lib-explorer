import {
	VALUE_TYPE_STRING//,
	//toStr
} from '@enonic/js-utils';
import {PRINCIPAL_EXPLORER_WRITE} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';


export function addPropertiesToDocumentType({
	documentTypeId,
	properties
}) {
	//log.debug(`addPropertiesToDocumentType documentTypeId:${toStr(documentTypeId)} properties:${toStr(properties)}`);
	const writeConnection = connect({ principals: [PRINCIPAL_EXPLORER_WRITE] });
	const modifiedDocumentTypeNode = writeConnection.modify({
		key: documentTypeId,
		editor: (documentTypeNode) => {
			if (!documentTypeNode.properties) {
				documentTypeNode.properties = [];
			}
			if (!Array.isArray(documentTypeNode.properties)) {
				documentTypeNode.properties = [documentTypeNode.properties];
			}
			properties.forEach((propertyName) => {
				documentTypeNode.properties.push({
					enabled: true,
					fulltext: true,
					includeInAllText: true,
					max: 0,
					min: 0,
					name: propertyName,
					ngram: true,
					valueType: VALUE_TYPE_STRING
				});
			});
			documentTypeNode.properties = documentTypeNode.properties.sort((a, b) => (a.name > b.name) ? 1 : -1);
			return documentTypeNode;
		}
	});
	//log.debug(`addPropertiesToDocumentType modifiedDocumentTypeNode:${toStr(modifiedDocumentTypeNode)}`);
	return modifiedDocumentTypeNode;
}
