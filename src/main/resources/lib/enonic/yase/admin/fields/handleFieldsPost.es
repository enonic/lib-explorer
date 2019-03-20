import {toStr} from '/lib/enonic/util';
import {sanitize} from '/lib/xp/common';

import {
	BRANCH_ID,
	NT_FIELD,
	NT_FIELD_VALUE,
	REPO_ID,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';
import {createNode} from '/lib/enonic/yase/createNode';
import {modifyNode} from '/lib/enonic/yase/modifyNode';
import {ucFirst} from '/lib/enonic/yase/ucFirst';
import {fieldsPage} from '/lib/enonic/yase/admin/fields/fieldsPage';
import {createOrEditFieldPage} from '/lib/enonic/yase/admin/fields/createOrEditFieldPage';


export function handleFieldsPost({
	params,
	path: reqPath
}) {
	const relPath = reqPath.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	const fieldName = pathParts[1];
	const action = pathParts[2]; // update, delete, values
	const valueName = pathParts[3];
	const valueAction = pathParts[4];
	log.info(toStr({fieldName, action, valueName, valueAction}));

	if(action === 'values') {
		if(valueAction === 'delete') {
			const connection = connectRepo({
				repoId: REPO_ID,
				branch: BRANCH_ID
			});
			const nodePath = `/fields/${fieldName}/${valueName}`;
			const deleteRes = connection.delete(nodePath);
			//log.info(toStr({deleteRes}));
			return createOrEditFieldPage({path: reqPath}, {
				messages: deleteRes.length
					? [`Field value with path:${nodePath} deleted.`]
					: [`Something went wrong when trying to delete field value with path:${nodePath}.`],
				status: deleteRes.length ? 200 : 500
			});
		}

		const messages = [];
		let status = 200;

		let {value, displayName} = params;
		log.info(toStr({value, displayName}));
		if (!value) {
			if (!displayName) {
				return createOrEditFieldPage({path: reqPath}, {
					messages: [`You must provide either value or display name!`],
					status: 400
				});
			}
			value = sanitize(displayName);
		} else if (!displayName) {
			displayName = ucFirst(value);
		}

		if(valueName && valueName !== value) {
			messages.push(`You are not allowed to modify the value, only the displayName!`);
			status=400;
		}
		const valueNodeParentPath = `/fields/${fieldName}`;
		const valueNodeName = sanitize(value.toLowerCase());
		const valueNodePath = `${valueNodeParentPath}/${valueNodeName}`;

		const nodeParams = {
			_indexConfig: {default: 'byType'},
			_parentPath: valueNodeParentPath,
			_name: valueNodeName,
			displayName,
			field: fieldName,
			type: NT_FIELD_VALUE
		};
		const node = valueName ? modifyNode(nodeParams) : createNode(nodeParams);
		if(node) {
			messages.push(`Field value with path:${valueNodePath} ${valueName ? 'modified' : 'created'}.`);
		} else {
			messages.push(`Something went wrong when trying to ${valueName ? 'modify' : 'create'} field value with path:${valueNodePath}.`);
			status = 500;
		}

		return createOrEditFieldPage({path: reqPath},{messages, status});
	} // values

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
		path,
		fieldType = 'text'
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
		fieldType,
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
