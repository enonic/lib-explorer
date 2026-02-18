import type {
	CreateNodeParams,
	Node,
} from '/lib/xp/node';
import type {
	DocumentTypeCreateParams,
	DocumentTypeNode,
	DocumentTypeNodeSpecific,
	Path as PathType,
	ParentPath,
	WriteConnection
} from '../types.d';


import {
	Folder,
	NodeType,
	Path,
	Principal
} from '@enonic/explorer-utils'
import {
	forceArray,
	//toStr
} from '@enonic/js-utils';
import { EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_CREATED } from '/lib/explorer/constants';
import { connect } from '/lib/explorer/repo/connect';
import { create } from '/lib/explorer/node/create';
import { send } from '/lib/xp/event';
// import {reference} from '/lib/xp/value';
import {coerseDocumentType} from './coerseDocumentType';


export type CreateDocumentTypeParams = Partial<DocumentTypeNodeSpecific> & {
	_name: Node['_name']
};


export function createDocumentType({
	_name,
	addFields = true,
	version,
	managedBy,
	properties = []
}: CreateDocumentTypeParams) {
	//log.debug(`_name:${_name} addFields:${addFields} fields:${toStr(fields)} properties:${toStr(properties)}`);
	const writeConnection = connect({ principals: [Principal.EXPLORER_WRITE] }) as WriteConnection;
	if (!writeConnection.exists(Path.DOCUMENT_TYPES)) {
		create({
			_name: Folder.DOCUMENT_TYPES,
			_nodeType: NodeType.FOLDER,
		}, {
			connection: writeConnection,
		});
	}
	const _parentPath: ParentPath = Path.DOCUMENT_TYPES;
	const _path: PathType = `${_parentPath}/${_name}`;
	if (writeConnection.exists(_path)) {
		throw new Error(`A documentType with _name:${_name} already exists!`);
	}
	const nodeToBeCreated: CreateDocumentTypeParams & {
		_nodeType: Node['_nodeType']
		_parentPath?: CreateNodeParams['_parentPath']
	} = {
		_name,
		_nodeType: NodeType.DOCUMENT_TYPE,
		_parentPath,
		addFields,
		managedBy, // undefined is allowed

		// No point in forceArray, since Enonic will "destroy" on store,
		// but we're using forceArray so sort don't throw...
		properties: forceArray(properties).sort((a, b) => (a.name > b.name) ? 1 : -1)
	};
	if (version) {
		// Only managed documentTypes should have version
		nodeToBeCreated.version = version;
	}
	const createdNode = create<DocumentTypeCreateParams>(nodeToBeCreated, {
		connection: writeConnection,
	}) as DocumentTypeNode;
	//writeConnection.refresh(); // Not needed?

	send({
		type: EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_CREATED,
		distributed: true,
		data: createdNode
	});

	return coerseDocumentType(createdNode);
}
