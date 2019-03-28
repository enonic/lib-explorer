//import {toStr} from '/lib/enonic/util';
import {sanitize} from '/lib/xp/common';
import {
	NT_TAG,
	PATH_TAG,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {create} from '/lib/enonic/yase/node/create';
import {modify} from '/lib/enonic/yase/node/modify';
import {ucFirst} from '/lib/enonic/yase/ucFirst';
import {tagsPage} from '/lib/enonic/yase/admin/tags/tagsPage';


export function handleTagsPost({
	params: {
		displayName,
		field,
		//id,
		operation = 'CREATE',
		tag
	}
}) {
	//log.info(toStr({displayName, field, operation, tag}));
	const messages = [];
	let status = 200;
	if(!field) {
		messages.push('Missing parameter field!');
		status = 400;
	}
	if (!tag) {
		if (!displayName) {
			messages.push('You must provide either tag or displayName!');
			status = 400;
		} else {
			tag = sanitize(displayName);
		}
	} else {
		if (!displayName) {
			displayName = ucFirst(tag);
		}
	}

	if (status !== 200) {
		return tagsPage({
			path: `${TOOL_PATH}/tags`
		}, {messages, status});
	}

	//log.info(toStr({displayName, field, tag}));
	const name = tag.toLowerCase(); // sanitized in create/modify
	const parentPath = `${PATH_TAG}/${field}`;

	const params = {
		_parentPath: parentPath,
		_name: name,
		_indexConfig: {
			default: 'byType'
		},
		displayName,
		field,
		tag,
		type: NT_TAG
	};
	//log.info(toStr({params}));

	const node = operation === 'CREATE' ? create(params) : modify(params);
	//log.info(toStr({node}));

	return tagsPage({
		path: `${TOOL_PATH}/tags`
	}, {
		messages: node
			? [`Tag ${parentPath}/${name} ${operation === 'CREATE' ? 'created' : 'modified'}.`]
			: [`Something went wrong while ${operation === 'CREATE' ? 'creating' : 'modifying'} tag ${parentPath}/${name}!`],
		status: node ? 200 : 500
	});
}
