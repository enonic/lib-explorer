import generateUuidv4 from 'uuid/v4';

//import {getUser} from '/lib/xp/auth';
import {sanitize} from '/lib/xp/common';

import {NT_FOLDER} from '/lib/explorer/model/2/constants';
import {exists} from '/lib/explorer/node/exists';


export function createRandomNamed({
	__connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	//__user = getUser(),
	_id, // So it doesn't end up in rest
	_indexConfig = {default: 'byType'},
	_inheritsPermissions = true,
	_name = sanitize(generateUuidv4()),
	_parentPath = '/',
	_permissions = [],
	//creator = __user.key,
	...rest
}) {
	const pathParts = _parentPath.split('/'); //log.info(toStr({pathParts}));
	for (let i = 1; i < pathParts.length; i += 1) {
		const path = pathParts.slice(0, i + 1).join('/'); //log.info(toStr({path}));
		const ancestor = __connection.get(path); //log.info(toStr({ancestor}));
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
			__connection.create(folderParams);
			//log.info(toStr({folder}));
		}
	}

	while (exists({
		connection: __connection,
		_parentPath,
		_name
	})) {
		_name = sanitize(generateUuidv4());
	}

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

	const createRes = __connection.create(CREATE_PARAMS);
	__connection.refresh(); // So the data becomes immidiately searchable
	return createRes;
} // createRandomNamed
