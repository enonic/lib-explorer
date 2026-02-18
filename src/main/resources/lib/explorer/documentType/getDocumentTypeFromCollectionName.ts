import type {
	CollectionNode,
} from '../types.d';

// import {toStr} from '@enonic/js-utils';
import {get as getCollection} from '/lib/explorer/collection/get';
import {connect} from '/lib/explorer/repo/connect';
import {getDocumentType} from '/lib/explorer/documentType/getDocumentType';
import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/model/2/constants';


export function getDocumentTypeFromCollectionName({collectionName}) {
	//log.debug(`getDocumentTypeFromCollectionName collectionName:${toStr(collectionName)}`);
	const readConnection = connect({ principals: [PRINCIPAL_EXPLORER_READ] });
	const collectionNode = getCollection({
		connection: readConnection,
		name: collectionName
	}) as CollectionNode;
	//log.debug(`getDocumentTypeFromCollectionName collectionNode:${toStr(collectionNode)}`);

	const {documentTypeId} = collectionNode;
	//log.debug(`getDocumentTypeFromCollectionName documentTypeId:${toStr(documentTypeId)}`);
	if (!documentTypeId) {
		throw new Error(`Collection name:${collectionName} doesn't contain a documentTypeId!`);
	}

	const documentTypeNode = getDocumentType({
		_id: documentTypeId.toString(),
		connection: readConnection
	});

	//log.debug(`getDocumentTypeFromCollectionName documentTypeNode:${toStr(documentTypeNode)}`);
	return documentTypeNode;
}
