import type {Application} from '../../../../../index.d';
import type {
	IndexConfigObject,
	Name,
	//Path,
	ParentPath//,
	//PermissionsParams
} from '/lib/explorer/types.d';
import type {TaskDescriptor} from '/lib/explorer/task/types.d';


import {
	indexTemplateToConfig//,
	//toStr
} from '@enonic/js-utils';

import {
	DOCUMENT_METADATA,
	NT_DOCUMENT
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
import {hash} from '/lib/explorer/string/hash';


export function Document({
	_parentPath = '/',
	uri,
	_name = hash(uri),
	collectorAppName = app.name,
	collectorId = app.name, // <appname>:<taskname>
	collectorVersion = app.version,
	//text,
	//title,
	...rest
} :{
	//_id :Id
	//_path :Path
	//_permissions :Array<PermissionsParams>
	uri :string
	// Optional
	_name? :Name
	_parentPath? :ParentPath
	collectorAppName? :Application.Key
	collectorId? :TaskDescriptor | Application.Key
	collectorVersion? :string
	//displayName? :string
}) {
	if (!uri) { throw new Error('Missing required property uri!'); }
	delete rest['_id'];
	delete rest['_path'];
	delete rest['_permissions'];
	return node({
		...rest,
		_parentPath,
		_indexConfig: {
			default: indexTemplateToConfig({
				template: 'byType', // TODO Perhaps minimal?
				indexValueProcessors: [],
				languages: []
			}) as IndexConfigObject,
			configs: [{
				path: 'collectorAppName',
				config: indexTemplateToConfig({
					template: 'minimal',
					indexValueProcessors: [],
					languages: []
				}) as IndexConfigObject
			},{
				path: 'collectorId',
				config: indexTemplateToConfig({
					template: 'minimal',
					indexValueProcessors: [],
					languages: []
				}) as IndexConfigObject
			},{
				path: 'collectorVersion',
				config: indexTemplateToConfig({
					template: 'minimal',
					indexValueProcessors: [],
					languages: []
				}) as IndexConfigObject
			},{
				path: DOCUMENT_METADATA,
				config: indexTemplateToConfig({
					template: 'minimal',
					indexValueProcessors: [],
					languages: []
				}) as IndexConfigObject
			},{
				path: 'uri',
				config: indexTemplateToConfig({
					template: 'byType',
					indexValueProcessors: [],
					languages: []
				}) as IndexConfigObject
			}] // TODO indexConfig for ...rest
		},
		//_inheritsPermissions: true,
		_name,
		_nodeType: NT_DOCUMENT,
		collectorAppName,
		collectorId, // <appname>:<taskname>
		collectorVersion,
		[DOCUMENT_METADATA]: {
			createdTime: new Date()//,
			//modifiedTime: new Date(),
			//valid: ?, // TODO validation of ...rest
		},
		//text,
		//title,
		uri
	});
} // Document