import type {
	ParentPath,
	WriteConnection
} from '/lib/explorer/types/index.d';


import {
	isNotSet,
	toStr
} from '@enonic/js-utils';

//@ts-ignore
import {sanitize as doSanitize} from '/lib/xp/common';

import {join} from '../path/join';


export function modify<N extends {
	_id? :string
	_name? :string
	_parentPath? :ParentPath
	displayName? :string
	modifiedTime?: Date | string
}>({
	_id, // So it doesn't end up in rest.
	_parentPath = '/',
	_name, // WARNING: Maybe undefined? NO, connection.modify requires it!!!
	displayName = Array.isArray(_name)
		? _name.join(', ')
		: _name, // Maybe undefined
	...rest
} :N, {
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	sanitize,
	...ignoredOptions
} :{
	connection :WriteConnection,
	sanitize? :boolean
}) :N {
	//log.info(toStr({key, displayName, rest}));

	Object.keys(rest).forEach((k) => {
		if (k.startsWith('__')) {
			log.warning(`Deprecation: Function signature changed. Added second argument for options.
		Old: node.modify({${k}, ...})
		New: node.modify({...}, {${k.substring(2)}})`);
			if(k === '__connection') {
				if (isNotSet(connection)) {
					connection = rest[k];
				}
			} else if(k === '__sanitize') {
				if (isNotSet(sanitize)) {
					sanitize = rest[k];
				}
			} else {
				log.warning(`node.modify: Ignored option:${k} value:${toStr(rest[k])}`);
			}
			delete rest[k];
		}
	});

	if (isNotSet(sanitize)) {
		sanitize = true;
	}

	if (Object.keys(ignoredOptions).length) {
		log.warning(`node.modify: Ignored options:${toStr(ignoredOptions)}`);
	}

	const key = _id || join(_parentPath, sanitize ? doSanitize(_name) : _name);
	//log.info(`key:${key}`);
	return connection.modify({
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
