//import {toStr} from '/lib/util';
import {sanitize} from '/lib/xp/common';
import {join} from '/lib/explorer/path/join';

export function modify({
	__connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	__sanitize = true,
	_id, // So it doesn't end up in rest.
	_parentPath = '/',
	_name, // WARNING: Maybe undefined? NO, connection.modify requires it!!!
	displayName = Array.isArray(_name)
		? _name.join(', ')
		: _name, // Maybe undefined
	...rest
} = {}) {
	//log.info(toStr({key, displayName, rest}));
	const key = _id || join(_parentPath, __sanitize ? sanitize(_name) : _name);
	//log.info(`key:${key}`);
	return __connection.modify({
		key,
		editor: (node) => {
			//log.info(`node:${toStr(node)}`);
			/* eslint-disable no-param-reassign */
			//node._timestamp = new Date(); // DOES NOT WORK?
			node.modifiedTime = new Date();
			node.displayName = displayName;
			Object.keys(rest).forEach((property) => {
				const value = rest[property];
				node[property] = value;
			});
			/* eslint-enable no-param-reassign */
			//log.info(`modifiedNode:${toStr(node)}`);
			return node;
		}
	});
}
