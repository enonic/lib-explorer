import type {JavaBridge} from '../../_coupling/types.d';
import type {
	DocumentTypeNode,
	Fields
} from '../../documentType/types.d';


//import {toStr} from '@enonic/js-utils';

import {
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
		properties :Fields
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
	return modifiedDocumentTypeNode;
} // update
