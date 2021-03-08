import {getUser} from '/lib/xp/auth';

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
	__user = getUser(),
	...rest
}) {
	return node({
		...rest,
		_indexConfig: {default: 'none'},
		_inheritsPermissions: true,
		_name,
		_parentPath,
		creator: __user.key,
		createdTime: new Date(),
		type: NT_FOLDER
	});
}
