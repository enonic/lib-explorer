import type {JavaBridge} from '../types.d';
import type {
	DocumentTypeNode,
	Fields
} from './types.d';


import {
	PRINCIPAL_EXPLORER_WRITE,
	REPO_ID_EXPLORER
} from '../constants';
import {javaBridgeDummy} from '../document/dummies';


export function update(
	{
		_id,
		properties
	} :{
		_id :string
		properties :Fields
	},
	javaBridge :JavaBridge = javaBridgeDummy
) :DocumentTypeNode {
	const explorerWriteConnection = javaBridge.connect({
		branch: 'master',
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId: REPO_ID_EXPLORER
	});
	return explorerWriteConnection.modify({
		key: _id,
		editor: (documentTypeNode :DocumentTypeNode) => {
			documentTypeNode.properties = properties;
			//documentTypeNode.modifiedTime = new Date() as string;
			return documentTypeNode;
		}
	});
} // update
