import {getUser} from '/lib/xp/auth';
import {toStr} from '/lib/util';
import {isNotSet} from '/lib/util/value';

import {
	NT_FOLDER
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function folder({

	// avoid from ...rest
	_id, // eslint-disable-line no-unused-vars
	_path, // eslint-disable-line no-unused-vars
	_permissions, // eslint-disable-line no-unused-vars

	_parentPath = '/',
	_name,
	...rest
}, {
	user,
	...ignoredOptions
}) {
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
		_inheritsPermissions: true,
		_name,
		_nodeType: NT_FOLDER,
		_parentPath,
		creator: user.key,
		createdTime: new Date()
	});
}
