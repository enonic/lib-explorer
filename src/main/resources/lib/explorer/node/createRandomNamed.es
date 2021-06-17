import {v4 as generateUuidv4} from 'uuid';

import {toStr} from '/lib/util';
import {isNotSet} from '/lib/util/value';
//import {getUser} from '/lib/xp/auth';
import {sanitize as doSanitize} from '/lib/xp/common';

import {NT_FOLDER} from '/lib/explorer/model/2/constants';
import {exists} from '/lib/explorer/node/exists';


export function createRandomNamed({
	_id, // So it doesn't end up in rest
	_indexConfig = {default: 'byType'},
	_inheritsPermissions = true,
	_name = doSanitize(generateUuidv4()),
	_parentPath = '/',
	_permissions = [],
	//creator = __user.key,
	...rest
}, {
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	...ignoredOptions
} = {}) {
	//log.info(`_name:${_name}`);

	Object.keys(rest).forEach((k) => {
		if (k.startsWith('__')) {
			log.warning(`Deprecation: Function signature changed. Added second argument for options.
		Old: node.createRandomNamed({${k}, ...})
		New: node.createRandomNamed({...}, {${k.substring(2)}})`);
			if(k === '__connection') {
				if (isNotSet(connection)) {
					connection = rest[k];
				}
			} else {
				log.warning(`node.createRandomNamed: Ignored option:${k} value:${toStr(rest[k])}`);
			}
			delete rest[k];
		}
	});

	if (Object.keys(ignoredOptions).length) {
		log.warning(`node.createRandomNamed: Ignored options:${toStr(ignoredOptions)}`);
	}

	const pathParts = _parentPath.split('/'); //log.info(toStr({pathParts}));
	for (let i = 1; i < pathParts.length; i += 1) {
		const path = pathParts.slice(0, i + 1).join('/'); //log.info(toStr({path}));
		const ancestor = connection.get(path); //log.info(toStr({ancestor}));
		if (!ancestor) {
			const folderParams = {
				_indexConfig: {default: 'none'},
				_inheritsPermissions: true,
				_name: pathParts[i],
				_parentPath: pathParts.slice(0, i).join('/') || '/',
				//creator,
				//createdTime: new Date(),
				type: NT_FOLDER
			};
			//log.info(toStr({folderParams}));
			//const folder =
			connection.create(folderParams);
			//log.info(toStr({folder}));
		}
	}

	// WARNING This might go on forever?
	while (exists({
		connection,
		_parentPath,
		_name
	})) {
		_name = doSanitize(generateUuidv4());
	}
	//log.info(`_name:${_name}`);

	const CREATE_PARAMS = {
		_indexConfig,
		_inheritsPermissions,
		_name,
		_parentPath,
		_permissions,
		//creator,
		//createdTime: new Date(),
		...rest
	};
	//log.info(toStr(CREATE_PARAMS));

	const createRes = connection.create(CREATE_PARAMS);
	connection.refresh(); // So the data becomes immidiately searchable
	return createRes;
} // createRandomNamed
