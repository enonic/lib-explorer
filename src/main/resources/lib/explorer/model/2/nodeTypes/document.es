import {
	indexTemplateToConfig//,
	//toStr
} from '@enonic/js-utils';

import {
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
}) {
	if (!uri) { throw new Error('Missing required property uri!'); }
	delete rest._id;
	delete rest._path;
	delete rest._permissions;
	return node({
		...rest,
		_parentPath,
		_indexConfig: {
			default: indexTemplateToConfig({
				template: 'byType', // TODO Perhaps minimal?
				indexValueProcessors: [],
				languages: []
			}),
			configs: [{
				path: 'collectorAppName',
				config: indexTemplateToConfig({
					template: 'minimal',
					indexValueProcessors: [],
					languages: []
				})
			},{
				path: 'collectorId',
				config: indexTemplateToConfig({
					template: 'minimal',
					indexValueProcessors: [],
					languages: []
				})
			},{
				path: 'collectorVersion',
				config: indexTemplateToConfig({
					template: 'minimal',
					indexValueProcessors: [],
					languages: []
				})
			},{
				path: 'document_metadata',
				config: indexTemplateToConfig({
					template: 'minimal',
					indexValueProcessors: [],
					languages: []
				})
			},{
				path: 'uri',
				config: indexTemplateToConfig({
					template: 'byType',
					indexValueProcessors: [],
					languages: []
				})
			}] // TODO indexConfig for ...rest
		},
		//_inheritsPermissions: true,
		_name,
		_nodeType: NT_DOCUMENT,
		collectorAppName,
		collectorId, // <appname>:<taskname>
		collectorVersion,
		document_metadata: {
			createdTime: new Date()//,
			//modifiedTime: new Date(),
			//valid: ?, // TODO validation of ...rest
		},
		//text,
		//title,
		uri
	});
} // Document
