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
	return __connection.modify({
		key: _id || join(_parentPath, __sanitize ? sanitize(_name) : _name),
		editor: (node) => {
			/* eslint-disable no-param-reassign */
			//node._timestamp = new Date(); // DOES NOT WORK?
			node.modifiedTime = new Date();
			node.displayName = displayName;
			//Object.entries(rest).forEach(([property, value]) => {
			Object.keys(rest).forEach((property) => {
				const value = rest[property];
				node[property] = value;
			});
			/* eslint-enable no-param-reassign */
			//log.info(toStr({node}));
			return node;
		}
	});
}
