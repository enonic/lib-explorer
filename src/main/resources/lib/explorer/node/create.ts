import type {
	IndexConfig,
	NodeCreateParams,
	ParentPath
} from '/lib/explorer/types.d';
import type {WriteConnection} from '../node/WriteConnection.d';

import {
	isNotSet,
	toStr
} from '@enonic/js-utils';

//@ts-ignore
import {getUser} from '/lib/xp/auth';
//@ts-ignore
import {sanitize as doSanitize} from '/lib/xp/common';
//import {get as getContext} from '/lib/xp/context';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	NT_FOLDER,
	ROOT_PERMISSIONS_EXPLORER
} from '/lib/explorer/constants';


/*interface NodeProperties {
	_indexConfig? :{
		default :string
	}
	_inheritsPermissions? :boolean
	_name :string
	_parentPath? :ParentPath
	_permissions? :Array<string>
	creator? :string
	displayName? :string
}*/


export function create<N extends NodeCreateParams & {
	creator? :string
	displayName? :string
}>({
	// It appears that properties that starts with an undescore are ignored, except the standard ones.
	// These doesn't work: _displayName _creator _createdTime _type

	// Mentioned in documentation:
	//_childOrder
	_indexConfig = {default: 'byType'},
	_inheritsPermissions = false, // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
	//_manualOrderValue
	_name,
	_parentPath = '/',
	_permissions = ROOT_PERMISSIONS_EXPLORER,
	//_timestamp // Automatically added

	// Our own standard properties (cannot start with underscore)
	creator,
	//createdTime,
	displayName = Array.isArray(_name)
		? _name.join(', ')
		: _name,
	//type,

	...rest
} :N, {
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	sanitize,
	user,
	...ignoredOptions
} :{
	connection :WriteConnection
	sanitize? :boolean
	user? :{
		key :string
	}
}) :N & {_id :string} {
	/*log.info(toStr({
		_parentPath, _name, displayName, rest
	}));*/
	Object.keys(rest).forEach((k) => {
		if (k.startsWith('__')) {
			log.warning(`Deprecation: Function signature changed. Added second argument for options.
		Old: node.create({${k}, ...})
		New: node.create({...}, {${k.substring(2)}})`);
			if(k === '__connection') {
				if (isNotSet(connection)) {
					connection = rest[k];
				}
			} else if(k === '__sanitize') {
				if (isNotSet(sanitize)) {
					sanitize = rest[k];
				}
			} else if(k === '__user') {
				if (isNotSet(user)) {
					user = rest[k];
				}
			} else {
				log.warning(`node.create: Ignored option:${k} value:${toStr(rest[k])}`);
			}
			delete rest[k];
		}
	});

	if (isNotSet(sanitize)) {
		sanitize = true;
	}

	if (isNotSet(user)) {
		user = getUser();
	}
	if (isNotSet(creator)) {
		creator = user.key;
	}

	if (Object.keys(ignoredOptions).length) {
		log.warning(`node.create: Ignored options:${toStr(ignoredOptions)}`);
	}

	//const context = getContext(); log.info(toStr({context}));
	const pathParts = _parentPath.split('/'); //log.info(toStr({pathParts}));
	for (let i = 1; i < pathParts.length; i += 1) {
		const path = pathParts.slice(0, i + 1).join('/'); //log.info(toStr({path}));
		const ancestor = connection.get(path); //log.info(toStr({ancestor}));
		if (!ancestor) {
			const folderParams = {
				_indexConfig: {default: 'none'} as IndexConfig,
				_inheritsPermissions: false,
				_name: pathParts[i],
				_parentPath: (pathParts.slice(0, i).join('/') || '/') as ParentPath,
				_permissions,
				creator,
				createdTime: new Date(),
				type: NT_FOLDER
			};
			//log.info(toStr({folderParams}));
			//const folder =
			connection.create(folderParams);
			//log.info(toStr({folder}));
		}
	}

	const CREATE_PARAMS = {
		_indexConfig,
		_inheritsPermissions, // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
		_name: sanitize ? doSanitize(_name) : _name,
		_parentPath,
		_permissions,
		creator,
		createdTime: new Date(),
		displayName,
		...rest
	};
	//log.info(toStr(CREATE_PARAMS));
	const createRes = connection.create(CREATE_PARAMS);
	connection.refresh(); // So the data becomes immidiately searchable
	return createRes as unknown as N & {_id :string};
}
