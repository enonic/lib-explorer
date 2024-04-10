import type {CollectionNode} from '@enonic-types/lib-explorer/Collection.d';


import {
	forceArray,
	//toStr
} from '@enonic/js-utils';

import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {
	// list as listTasks
	submitTask
} from '/lib/xp/task';

import {getDocumentType} from '/lib/explorer/documentType/getDocumentType';


export function reindexCollections({collectionIds}) {
	const reports = [];
	const seenDocumentTypes = {};
	const readConnection = connect({ principals: [PRINCIPAL_EXPLORER_READ] });
	forceArray(collectionIds).forEach((collectionId) => {
		const collectionNode = readConnection.get(collectionId) as CollectionNode;
		if (!collectionNode) {
			const message = `No collection with id:${collectionId}!`;
			log.error(message);
			reports.push({
				collectionId,
				message
			});
		} else {
			const {
				_name,
				documentTypeId // Can it be Reference on get?
			} = collectionNode;
			const documentTypeIdStr = documentTypeId ? documentTypeId.toString() : '';
			if(!documentTypeId) {
				const message = `Collection _id:${collectionId} _name:${_name} has no documentTypeId!`;
				log.warning(message);
				reports.push({
					collectionId,
					collectionName: _name,
					message
				});
			} else { // has documentType
				if (!seenDocumentTypes[documentTypeIdStr]) {
					seenDocumentTypes[documentTypeIdStr] = getDocumentType({_id: documentTypeIdStr});
				}
				const documentType = seenDocumentTypes[documentTypeIdStr];
				// log.info(`documentType:${toStr(documentType)}`);
				if (!documentType) {
					const message = `Unable to get documentTypeId:${documentTypeId} for collection _id:${collectionId} _name:${_name}!`;
					log.error(message);
					reports.push({
						collectionId,
						collectionName: _name,
						message,
						documentTypeId
					});
				} else {
					const taskId = submitTask({
						descriptor: `reindexCollection`,
						config: {
							collectionJson: JSON.stringify(collectionNode),
							documentTypeJson: JSON.stringify(documentType)
						}
					});
					const message = `Started reindex of collection _id:${collectionId} _name:${_name} documentTypeId:${documentTypeId}`;
					log.debug(message);
					reports.push({
						collectionId,
						collectionName: _name,
						message,
						documentTypeId,
						taskId
					});
				}
			} // end of else has documentType
		}
	}); // collectionIds.forEach
	return reports;
}
