import {
	BRANCH_ID,
	PRINCIPAL_YASE_WRITE,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';


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
	if (status === 200) {
		const connection = connect({
			repoId: REPO_ID,
			branch: BRANCH_ID,
			principals: [PRINCIPAL_YASE_WRITE]
		});
		const deleteRes = connection.delete(id);
		//log.info(toStr({deleteRes}));

		if (deleteRes.length) {
			messages.push(`Tag with id:${id} deleted.`);
		} else {
			messages.push(`Something went wrong when trying to delete tag with id:${id}.`);
			status = 500;
		}
	}

	return {
		redirect: `${TOOL_PATH}/tags?${
			messages.map(m => `messages=${m}`).join('&')
		}&status=${status}`
	}
}
