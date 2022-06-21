import type {JavaBridge} from '../../_coupling/types.d';
import type {
	DocumentTypeFields,
	DocumentTypeNode
} from '../../types/index.d';


//import {toStr} from '@enonic/js-utils';
//@ts-ignore
import {send} from '/lib/xp/event';
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
	//log.debug('documentType.update: _id:%s', _id);
	//log.debug('documentType.update: properties:%s', toStr(properties));
	const explorerWriteConnection = javaBridge.connect({
		branch: 'master',
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId: REPO_ID_EXPLORER
	});
	const modifiedDocumentTypeNode = explorerWriteConnection.modify({
		key: _id,
		editor: (documentTypeNode :DocumentTypeNode) => {
			//log.debug('documentType.update: old documentTypeNode:%s', toStr(documentTypeNode));
			documentTypeNode.properties = properties;
			//documentTypeNode.modifiedTime = new Date() as string;
			//log.debug('documentType.update: modification documentTypeNode:%s', toStr(documentTypeNode));
			return documentTypeNode;
		}
	});
	//log.debug('documentType.update: modifiedDocumentTypeNode:%s', toStr(modifiedDocumentTypeNode));
	explorerWriteConnection.refresh();

	send({
		type: EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED,
		distributed: true,
		data: modifiedDocumentTypeNode
	});

	return modifiedDocumentTypeNode;
} // update
