//import {toStr} from '/lib/enonic/util';
//import {sanitize} from '/lib/xp/common';
import {
	NT_TAG,
	PATH_TAG,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {createNode} from '/lib/enonic/yase/createNode';
import {ucFirst} from '/lib/enonic/yase/ucFirst';
import {tagsPage} from '/lib/enonic/yase/admin/tags/tagsPage';


export function handleTagsPost({
	params: {
		field,
		tag,
		displayName
	}
}) {
	if (!displayName || !displayName.length) {
		displayName = ucFirst(tag);
	}
	//log.info(toStr({_parentPath, name, displayName}));
	const name = tag.toLowerCase(); // sanitize
	const parentPath = `${PATH_TAG}/${field}`;

	const createNodeParams = {
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
	//log.info(toStr({createNodeParams}));

	const node = createNode(createNodeParams);
	//log.info(toStr({node}));

	return tagsPage({
		path: `${TOOL_PATH}/tags`
	}, {
		messages: node
			? [`Tag ${parentPath}/${name} created.`]
			: [`Something went wrong while creating tag ${parentPath}/${name}!`],
		status: node ? 200 : 500
	});
}
