import {
	BRANCH_ID,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {tagsPage} from '/lib/enonic/yase/admin/tags/tagsPage';


export function handleTagDelete({
	path,
	params: {
		id,
		operation
	}
}) {
	const messages = [];
	let status = 200;
	if(!id) {
		messages.push('Missing parameter id');
		status = 400;
	}
	if(operation !== 'DELETE') {
		messages.push('Parameter operation !== DELETE');
		status = 400;
	}
	if (status !== 200) {
		return tagsPage({path}, {messages, status});
	}
	const connection = connect({
		repoId: REPO_ID,
		branch: BRANCH_ID
	});
	const deleteRes = connection.delete(id);
	//log.info(toStr({deleteRes}));
	return tagsPage({path}, {
		messages: deleteRes.length
			? [`Tag with id:${id} deleted.`]
			: [`Something went wrong when trying to delete tag with id:${id}.`],
		status: deleteRes.length ? 200 : 500
	});
}
