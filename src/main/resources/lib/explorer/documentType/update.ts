import type {
	DocumentTypeFields,
	DocumentTypeNode
} from '@enonic-types/lib-explorer/index.d';

import {send} from '/lib/xp/event';
import {connect} from '/lib/xp/node';
// import {toStr} from '@enonic/js-utils';
import {
	EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED,
	PRINCIPAL_EXPLORER_WRITE,
	REPO_ID_EXPLORER
} from '/lib/explorer/constants';


// NOTE: This function is ONLY? used by /lib/explorer/document/addExtraFieldsToDocumentType
export function update(
	{
		_id,
		properties
	}: {
		_id: string
		properties: DocumentTypeFields
	},
): DocumentTypeNode {
	const connectParams = {
		branch: 'master',
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId: REPO_ID_EXPLORER
	};
	// log.debug('documentType.update: connecting using connectParams:%s ...', toStr(connectParams));

	const explorerWriteConnection = connect(connectParams);
	// log.debug('documentType.update: connected using connectParams:%s :)', toStr(connectParams));

	// log.debug('documentType.update: _id:%s', _id);
	// log.debug('documentType.update: properties:%s', toStr(properties));
	const modifiedDocumentTypeNode = explorerWriteConnection.modify({
		key: _id,
		editor: (documentTypeNode: DocumentTypeNode) => {
			// log.debug('documentType.update: old documentTypeNode:%s', toStr(documentTypeNode));
			documentTypeNode.properties = properties;
			//documentTypeNode.modifiedTime = new Date() as string;
			// log.debug('documentType.update: modification documentTypeNode:%s', toStr(documentTypeNode));
			return documentTypeNode;
		}
	});
	// log.debug('documentType.update: modifiedDocumentTypeNode:%s', toStr(modifiedDocumentTypeNode));

	// log.debug('documentType.update: refreshing index...');
	explorerWriteConnection.refresh();
	// log.debug('documentType.update: refreshed index :)');

	send({
		type: EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED,
		distributed: true,
		data: modifiedDocumentTypeNode
	});

	return modifiedDocumentTypeNode;
} // update
