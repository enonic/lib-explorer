import type { PrincipalKey } from '/lib/xp/auth';
import type {
	IndexConfig,
	NodeCreateParams,
	ParentPath,
	WriteConnection
} from '/lib/explorer/types/index.d';


import {
	ROOT_PERMISSIONS_EXPLORER,
	Principal,
	RootPermission
} from '@enonic/explorer-utils';
import {
	isNotSet,
	toStr
} from '@enonic/js-utils';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import {getUser} from '/lib/xp/auth';
import {sanitize as doSanitize} from '/lib/xp/common';
//import {get as getContext} from '/lib/xp/context';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	NT_FOLDER,
} from '/lib/explorer/constants';


/*interface NodeProperties {
	_indexConfig?: {
		default: string
	}
	_inheritsPermissions?: boolean
	_name: string
	_parentPath?: ParentPath
	_permissions?: string[]
	creator?: string
	displayName?: string
}*/


export function create<N extends NodeCreateParams & {
	creator?: string
	displayName?: string
}>({
	// It appears that properties that starts with an undescore are ignored, except the standard ones.
	// These doesn't work: _displayName _creator _createdTime _type

	// Mentioned in documentation:
	//_childOrder
	_indexConfig = {default: 'byType'} as IndexConfig,
	_inheritsPermissions = false, // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
	//_manualOrderValue
	_name,
	_parentPath = '/',
	_permissions = [], // See safePermissions below
	//_timestamp // Automatically added

	// Our own standard properties (cannot start with underscore)
	creator,
	//createdTime,
	displayName = Array.isArray(_name)
		? _name.join(', ')
		: _name,
	//type,

	...rest
}: N, {
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	sanitize,
	user,
	...ignoredOptions
}: {
	connection: WriteConnection
	sanitize?: boolean
	user?: {
		key: string
	}
}): N & {_id: string} {
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

	//log.debug('node.create doSanitize(%s):%s', _name, doSanitize(_name)); // Turns _ into - :(
	if (_name && sanitize) {
		_name = doSanitize(_name)
			// Fix #210 Duplicate collection uses - rather than _
			// caused #258 Cannot create node with name test, parent '/api-keys' not found
			//
			// The GraphQL specification names uses /[_A-Za-z][_0-9A-Za-z]*/
			// https://spec.graphql.org/June2018/#sec-Names
			//
			// Enonic XP node ids are uuidv4 which is /[0-9a-f-]/
			// When you create a node without a _name it becomes the same as the _id
			// node.type:document names shouldn't be exposed in GraphQL, so the mismatch isn't a problem.
			//
			// In Explorer UI collection names are limited to /^[a-z][0-9a-zA-Z_]/
			// This is because collection names, are used as repo names and in interface GraphQL API schema.
			//
			// #258 can be fixed in multiple ways:
			// 1. In app-explorer/tasks/migrate use create with sanitize: false
			// 2.
			// 2.1 Change Folder.API_KEYS from 'api-keys' to 'api_keys' in @enonic/explorer-utils
			// 2.2 Create new migration to move /api-keys/* to /api_keys/
			// I think I will do 1 for now, maybe 2 later.
			.replace(/-/g, '_');
	}
	const CREATE_PARAMS = {
		_indexConfig,
		_inheritsPermissions, // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
		_name,
		_parentPath,
		//_permissions: safePermissions, // Added below
		creator,
		createdTime: new Date(),
		displayName,
		...rest
	};
	//log.info(toStr(CREATE_PARAMS));

	const safePermissions = [...ROOT_PERMISSIONS_EXPLORER]; // deref
	if (!Array.isArray(_permissions)) {
		_permissions = [_permissions];
	}
	for (let index = 0; index < _permissions.length; index++) {
		let {
			principal,
			allow
		} = _permissions[index];
		if (!arrayIncludes([
			Principal.EXPLORER_READ,
			Principal.EXPLORER_WRITE,
			Principal.SYSTEM_ADMIN
		] as PrincipalKey[], principal)) {
			// Other principals are not allowed write access
			if (!Array.isArray(allow)) {
				allow = [allow];
			}
			if (
				allow.length > 0
				&& (
					allow.length > 1 || allow[0] !== 'READ'
				)
			) {
				log.warning(`node.create: Principal:${principal} is not allowed write access! Tried to set allow:${toStr(allow)} CREATE_PARAMS:${toStr(CREATE_PARAMS)})}`);
				if (arrayIncludes(allow, 'READ')) {
					safePermissions.push({
						principal,
						allow: 'READ'
					});
				}
			}
		}
	} // for
	CREATE_PARAMS['_permissions'] = safePermissions;

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
				_permissions: safePermissions,
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

	const createRes = connection.create(CREATE_PARAMS);
	connection.refresh(); // So the data becomes immidiately searchable
	return createRes as unknown as N & {_id: string};
}
