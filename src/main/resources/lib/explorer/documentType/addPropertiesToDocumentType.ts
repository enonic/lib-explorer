import type {DocumentTypeNode} from '/lib/explorer/documentType/types.d';


import {
	INDEX_CONFIG_N_GRAM,
	VALUE_TYPE_STRING//,
	//toStr
} from '@enonic/js-utils';
import {PRINCIPAL_EXPLORER_WRITE} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
//import {getCachedDocumentType} from '/lib/explorer/documentType/documentTypesCache';


export function addPropertiesToDocumentType({
	documentTypeId,
	properties
}) {
	//log.debug(`addPropertiesToDocumentType documentTypeId:${toStr(documentTypeId)} properties:${toStr(properties)}`);
	const writeConnection = connect({ principals: [PRINCIPAL_EXPLORER_WRITE] });
	const modifiedDocumentTypeNode :DocumentTypeNode = writeConnection.modify({
		key: documentTypeId,
		editor: (documentTypeNode :DocumentTypeNode) => {
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
					[INDEX_CONFIG_N_GRAM]: true,
					valueType: VALUE_TYPE_STRING
				});
			});
			documentTypeNode.properties = documentTypeNode.properties.sort((a, b) => (a.name > b.name) ? 1 : -1);
			return documentTypeNode;
		}
	});
	//log.debug(`addPropertiesToDocumentType modifiedDocumentTypeNode:${toStr(modifiedDocumentTypeNode)}`);
	/*getCachedDocumentType({ WARNING Cache remove is not cluster "safe"
		_id: modifiedDocumentTypeNode._id,
		refresh: true
	});*/
	return modifiedDocumentTypeNode;
}
