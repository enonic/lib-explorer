import type {
	Name,
	Path,
	ParentPath
} from '/lib/explorer/types.d';
import type {WriteConnection} from '../node/WriteConnection.d';
import type {Field} from '../types/Field.d';

import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';
import {
	NT_FOLDER,
	PRINCIPAL_EXPLORER_WRITE
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';

//@ts-ignore
//import {reference} from '/lib/xp/value';

import {
	NAME_DOCUMENT_TYPE_FOLDER,
	NT_DOCUMENT_TYPE,
	PATH_DOCUMENT_TYPE_FOLDER
} from './constants';

import {coerseDocumentType} from './coerseDocumentType';


export function createDocumentType({
	_name,
	addFields = true,
	properties = []
} :{
	_name: Name
	addFields? :boolean
	properties? :Array<Field>
}) {
	//log.debug(`_name:${_name} addFields:${addFields} fields:${toStr(fields)} properties:${toStr(properties)}`);
	const writeConnection = connect({ principals: [PRINCIPAL_EXPLORER_WRITE] }) as WriteConnection;
	if (!writeConnection.exists(PATH_DOCUMENT_TYPE_FOLDER)) {
		writeConnection.create({
			_name: NAME_DOCUMENT_TYPE_FOLDER,
			_nodeType: NT_FOLDER
		});
	}
	const _parentPath :ParentPath = PATH_DOCUMENT_TYPE_FOLDER;
	const _path :Path = `${_parentPath}/${_name}`;
	if (writeConnection.exists(_path)) {
		throw new Error(`A documentType with _name:${_name} already exists!`);
	}
	const nodeToBeCreated = {
		_name,
		_nodeType: NT_DOCUMENT_TYPE,
		_parentPath,
		addFields,

		// No point in forceArray, since Enonic will "destroy" on store,
		// but we're using forceArray so sort don't throw...
		properties: forceArray(properties).sort((a, b) => (a.name > b.name) ? 1 : -1)
	};
	const createdNode = writeConnection.create(nodeToBeCreated);
	return coerseDocumentType(createdNode);
}
