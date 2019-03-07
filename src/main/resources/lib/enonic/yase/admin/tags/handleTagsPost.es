import {toStr} from '/lib/enonic/util';
import {
	NT_TAG,
	PATH_TAG,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {createNode} from '/lib/enonic/yase/createNode';
import {tagsPage} from '/lib/enonic/yase/admin/tags/tagsPage';


export function handleTagsPost({
	params: {
		_parentPath = PATH_TAG,
		name, // sanitize(displayName)
		displayName //ucFirst(name)
	}
}) {
	log.info(toStr({_parentPath, name, displayName}));

	const createNodeParams = {
		_parentPath,
		_name: name,
		_indexConfig: {
			default: 'byType'
		},
		displayName,
		type: NT_TAG
	};
	log.info(toStr({createNodeParams}));

	const node = createNode(createNodeParams);
	log.info(toStr({node}));

	return tagsPage({
		path: `${TOOL_PATH}/tags`
	}, {
		messages: node
			? [`Tag ${_parentPath}/${name} created.`]
			: [`Something went wrong while creating tag ${_parentPath}/${name}!`],
		status: node ? 200 : 500
	});
}
