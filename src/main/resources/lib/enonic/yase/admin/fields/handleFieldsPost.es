//import {toStr} from '/lib/enonic/util';
import {sanitize} from '/lib/xp/common';

import {NT_FIELD} from '/lib/enonic/yase/constants';
import {createNode} from '/lib/enonic/yase/createNode';
import {modifyNode} from '/lib/enonic/yase/modifyNode';
import {ucFirst} from '/lib/enonic/yase/ucFirst';
import {fieldsPage} from '/lib/enonic/yase/admin/fields/fieldsPage';


export function handleFieldsPost({
	params: {
		key,
		displayName,
		description = '',
		//iconUrl = '',
		instruction = 'type',
		decideByType = 'on',
		enabled = 'on',
		operation = 'CREATE',
		nGram = 'on',
		fulltext = 'on',
		includeInAllText = 'on',
		path
	},
	path: reqPath
}) {
	if (!key) {
		if (!displayName) {
			return fieldsPage({path: reqPath}, {
				messages: [`You must provide either key or Display name!`],
				status: 400
			});
		}
		key = sanitize(displayName);
	} else if (!displayName) {
		displayName = ucFirst(key);
	}
	/*log.info(toStr({
		key,
		instruction,
		decideByType,
		enabled,
		nGram,
		fulltext,
		includeInAllText,
		path,
	}));*/
	const lcKey = key.toLowerCase();
	const params = {
		_indexConfig: {default: 'byType'},
		_name: lcKey,
		_parentPath: '/fields',
		description,
		displayName,
		key: lcKey,
		//iconUrl,
		indexConfig: instruction === 'custom' ? {
			decideByType: decideByType && decideByType === 'on',
			enabled: enabled && enabled === 'on',
			nGram: nGram && nGram === 'on',
			fulltext: fulltext && fulltext === 'on',
			includeInAllText: includeInAllText && includeInAllText === 'on',
			path: path && path === 'on'
		} : instruction,
		type: NT_FIELD
	};
	const node = operation === 'CREATE' ? createNode(params) : modifyNode(params);
	//log.info(toStr({node}));
	return fieldsPage({path: reqPath}, {
		messages: node
			? [`Field with key:${lcKey} ${operation === 'CREATE' ? 'created' : 'modified'}.`]
			: [`Something went wrong when trying to ${operation === 'CREATE' ? 'create' : 'modify'} field with key:${lcKey}.`],
		status: node ? 200 : 500
	});
} // function post
