import type {JavaBridge} from '../../_coupling/types.d';
import type {
	DocumentTypeFields,
	DocumentTypeNode
} from '../../types/index.d';


// import {toStr} from '@enonic/js-utils';
import {
	EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED,
	PRINCIPAL_EXPLORER_WRITE,
	REPO_ID_EXPLORER
} from '../../constants';
//import {javaBridgeDummy} from '../dummies';


export function update(
	{
		_id,
		properties
	} :{
		_id :string
		properties :DocumentTypeFields
	},
	javaBridge :JavaBridge// = javaBridgeDummy
) :DocumentTypeNode {
	const connectParams = {
		branch: 'master',
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId: REPO_ID_EXPLORER
	};
	// javaBridge.log.debug('documentType.update: connecting using connectParams:%s ...', toStr(connectParams));

	const explorerWriteConnection = javaBridge.connect(connectParams);
	// javaBridge.log.debug('documentType.update: connected using connectParams:%s :)', toStr(connectParams));

	// javaBridge.log.debug('documentType.update: _id:%s', _id);
	// javaBridge.log.debug('documentType.update: properties:%s', toStr(properties));
	const modifiedDocumentTypeNode = explorerWriteConnection.modify({
		key: _id,
		editor: (documentTypeNode :DocumentTypeNode) => {
			// javaBridge.log.debug('documentType.update: old documentTypeNode:%s', toStr(documentTypeNode));
			documentTypeNode.properties = properties;
			//documentTypeNode.modifiedTime = new Date() as string;
			// javaBridge.log.debug('documentType.update: modification documentTypeNode:%s', toStr(documentTypeNode));
			return documentTypeNode;
		}
	});
	// javaBridge.log.debug('documentType.update: modifiedDocumentTypeNode:%s', toStr(modifiedDocumentTypeNode));

	// javaBridge.log.debug('documentType.update: refreshing index...');
	explorerWriteConnection.refresh();
	// javaBridge.log.debug('documentType.update: refreshed index :)');

	javaBridge.event.send({
		type: EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED,
		distributed: true,
		data: modifiedDocumentTypeNode
	});

	return modifiedDocumentTypeNode;
} // update
