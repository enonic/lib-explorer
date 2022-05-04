import type {WriteConnection} from '/lib/explorer/types/index.d';


import {
	isNotSet,
	toStr
} from '@enonic/js-utils';

import {response as newResponse} from '/lib/explorer/nodeTypes/response';
import {createOrModify} from '/lib/explorer/node/createOrModify';


export const persistResponse = ({
	_parentPath = '/',
	_name,
	request,
	response,
	...rest
} :{
	_name :string
	request :{}
	response :{}
	_parentPath? :string
}, {
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	...ignoredOptions
} :{
	connection :WriteConnection
}) => {
	//log.info(toStr({_parentPath, _name, request, response}));
	Object.keys(rest).forEach((k) => {
		if (k.startsWith('__')) {
			log.warning(`Deprecation: Function signature changed. Added second argument for options.
		Old: node.persistResponse({${k}, ...})
		New: node.persistResponse({...}, {${k.substring(2)}})`);
			if(k === '__connection') {
				if (isNotSet(connection)) {
					connection = rest[k];
				}
			} else {
				log.warning(`node.persistResponse: Ignored option:${k} value:${toStr(rest[k])}`);
			}
			delete rest[k];
		}
	});

	if (Object.keys(ignoredOptions).length) {
		log.warning(`node.persistResponse: Ignored options:${toStr(ignoredOptions)}`);
	}

	const params = newResponse({
		_parentPath,
		_name,
		request,
		response
	});
	//log.info(toStr({params}));
	//@ts-ignore
	return createOrModify(params, {connection});
}; // persistResponse
