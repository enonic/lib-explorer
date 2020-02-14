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
		_indexConfig: {default: 'byType'},
		_name,
		collectorAppName,
		collectorId, // <appname>:<taskname>
		collectorVersion,
		//text,
		//title,
		type: NT_DOCUMENT,
		uri
	});
} // Document
