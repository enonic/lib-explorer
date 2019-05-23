//import {toStr} from '/lib/util';
import {sanitize} from '/lib/xp/common';
import {join} from '/lib/explorer/path/join';

export function modify({
	__connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	_id, // So it doesn't end up in rest.
	_parentPath = '/',
	_name,
	displayName = Array.isArray(_name)
		? _name.join(', ')
		: _name,
	...rest
} = {}) {
	//log.info(toStr({key, displayName, rest}));
	return __connection.modify({
		key: join(_parentPath, sanitize(_name)),
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
