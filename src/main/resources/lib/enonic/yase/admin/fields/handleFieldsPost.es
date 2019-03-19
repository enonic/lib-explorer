//import {toStr} from '/lib/enonic/util';
import {sanitize} from '/lib/xp/common';

import {
	BRANCH_ID,
	NT_FIELD,
	REPO_ID,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';
import {createNode} from '/lib/enonic/yase/createNode';
import {modifyNode} from '/lib/enonic/yase/modifyNode';
import {ucFirst} from '/lib/enonic/yase/ucFirst';
import {fieldsPage} from '/lib/enonic/yase/admin/fields/fieldsPage';


export function handleFieldsPost({
	params,
	path: reqPath
}) {
	const relPath = reqPath.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	const fieldName = pathParts[1];
	const action = pathParts[2];

	if (action === 'delete') {
		const connection = connectRepo({
			repoId: REPO_ID,
			branch: BRANCH_ID
		});
		const path = `/fields/${fieldName}`;
		const deleteRes = connection.delete(path);
		//log.info(toStr({deleteRes}));
		return fieldsPage({path: reqPath}, {
			messages: deleteRes.length
				? [`Field with path:${path} deleted.`]
				: [`Something went wrong when trying to delete field with path:${path}.`],
			status: deleteRes.length ? 200 : 500
		});
	} // if action === 'delete'

	let {
		key,
		displayName
	} = params;
	const {
		description = '',
		//iconUrl = '',
		instruction = 'type',
		decideByType = 'on',
		enabled = 'on',
		nGram = 'on',
		fulltext = 'on',
		includeInAllText = 'on',
		path
	} = params;
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
	const nodeParams = {
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
	const node = fieldName ? modifyNode(nodeParams) : createNode(nodeParams);
	//log.info(toStr({node}));
	return fieldsPage({path: reqPath}, {
		messages: node
			? [`Field with key:${lcKey} ${fieldName ? 'modified' : 'created'}.`]
			: [`Something went wrong when trying to ${fieldName ? 'modify' : 'create'} field with key:${lcKey}.`],
		status: node ? 200 : 500
	});
} // function post
