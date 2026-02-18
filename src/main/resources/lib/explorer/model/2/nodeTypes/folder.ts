import type {User} from '@enonic-types/core';
import type {AccessControlEntry} from '/lib/xp/node';
import type {
	Id,
	// IndexConfig,
	Name,
	Path,
	ParentPath
} from '../../../types.d';

import {
	isNotSet,
	toStr
} from '@enonic/js-utils';
import {getUser} from '/lib/xp/auth';
import {
	NT_FOLDER,
	ROOT_PERMISSIONS_EXPLORER
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function folder({
	// avoid from ...rest
	_id, // eslint-disable-line no-unused-vars
	_path, // eslint-disable-line no-unused-vars

	_parentPath = '/',
	_permissions = ROOT_PERMISSIONS_EXPLORER,
	_name,
	...rest
}: {
	_id?: Id
	_name: Name
	_path?: Path
	_parentPath?: ParentPath
	_permissions?: AccessControlEntry[]
}, {
	user,
	...ignoredOptions
}: {
	user?: User
} = {}) {
	Object.keys(rest).forEach((k) => {
		if (k.startsWith('__')) {
			log.warning(`Deprecation: Function signature changed. Added second argument for options.
		Old: nodeType.folder({${k}, ...})
		New: nodeType.folder({...}, {${k.substring(2)}})`);
			if(k === '__user') {
				if (isNotSet(user)) {
					user = rest[k];
				}
			} else {
				log.warning(`nodeType.folder: Ignored option:${k} value:${toStr(rest[k])}`);
			}
			delete rest[k];
		}
	});

	if (isNotSet(user)) {
		user = getUser();
	}

	if (Object.keys(ignoredOptions).length) {
		log.warning(`nodeType.folder: Ignored options:${toStr(ignoredOptions)}`);
	}

	return node({
		...rest,
		_indexConfig: {default: 'minimal'},
		_inheritsPermissions: false, // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
		_name,
		_nodeType: NT_FOLDER,
		_parentPath,
		_permissions,
		creator: user.key,
		createdTime: new Date()
	});
}
