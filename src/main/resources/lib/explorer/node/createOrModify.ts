import type {
	NodeCreateParams//,
	//NodeModifyParams
} from '/lib/explorer/types.d';
import type {WriteConnection} from './WriteConnection.d';

import {
	isNotSet,
	toStr
} from '@enonic/js-utils';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {create} from '/lib/explorer/node/create';
import {modify} from '/lib/explorer/node/modify';


const CATCH_CLASS_NAMES = [
	'com.enonic.xp.node.NodeIdExistsException',
	'com.enonic.xp.node.NodeAlreadyExistAtPathException'
];


export function createOrModify<Node extends NodeCreateParams & {
	_id? :string
	displayName? :string
}>({
	_parentPath = '/',
	//_path = '/',
	_name,
	displayName = Array.isArray(_name)
		? _name.join(', ')
		: _name,
	...rest
} :Node, {
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	...ignoredOptions
} :{
	connection :WriteConnection
}) :Node {
	/*log.info(toStr({
		_parentPath, _name, displayName, rest
	}));*/
	Object.keys(rest).forEach((k) => {
		if (k.startsWith('__')) {
			log.warning(`Deprecation: Function signature changed. Added second argument for options.
		Old: node.createOrModify({${k}, ...})
		New: node.createOrModify({...}, {${k.substring(2)}})`);
			if(k === '__connection') {
				if (isNotSet(connection)) {
					connection = rest[k];
				}
			} else {
				log.warning(`node.create: Ignored option:${k} value:${toStr(rest[k])}`);
			}
			delete rest[k];
		}
	});

	if (Object.keys(ignoredOptions).length) {
		log.warning(`node.createOrModify: Ignored options:${toStr(ignoredOptions)}`);
	}

	let rv :Node;
	try {
		//@ts-ignore
		rv = create({
			_parentPath, _name, displayName, ...rest
		}, {connection});
	} catch (catchedError) {
		if (catchedError.class && CATCH_CLASS_NAMES.includes(catchedError.class.name)) {
			//@ts-ignore
			rv = modify({
				_parentPath, _name, displayName, ...rest
			}, {connection});
		} else {
			if (catchedError.class) {
				log.error(toStr({catchedErrorClassName: catchedError.class.name}), catchedError);
			}
			log.error(toStr({catchedErrorMessage: catchedError.message}), catchedError);
			throw catchedError;
		}
	}
	//log.info(toStr({createOrModifyNodeRv: rv}));
	return rv;
}
