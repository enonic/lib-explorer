import {
	PRINCIPAL_YASE_WRITE,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {create} from '/lib/enonic/yase/node/create';
import {modify} from '/lib/enonic/yase/node/modify';
import {toStr} from '/lib/enonic/util';
import {synonym} from '/lib/enonic/yase/nodeTypes/synonym';
import {connect} from '/lib/enonic/yase/repo/connect';


export function handlePost({
	params: {
		from = '',
		id,
		to = ''
	},
	path
}) {
	const relPath = path.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	//const action = pathParts[1]; // synonyms
	const thesaurusName = pathParts[2];
	const secondaryAction = pathParts[3]; // create delete update
	const synonymName = pathParts[4];

	const _parentPath = path.replace(TOOL_PATH, '');
	log.info(toStr({
		from, id, to, path, _parentPath
	}));
	const connection = connect({
		principals: [PRINCIPAL_YASE_WRITE]
	});
	const params = synonym({
		__connection: connection,
		_parentPath,
		from,
		to
	});

	const messages = [];
	let status = 200;


	if (id) {
		params.key = id;
		const node = modify(params);
		if (node) {
			messages.push(`Updated synonym ${from}.`);
		} else {
			messages.push(`Something went wrong when trying to update synonym ${from}!`);
			status = 500;
		}
		return {
			redirect: `${TOOL_PATH}/thesauri/edit/${thesaurusName}?${
				messages.map(m => `messages=${m}`).join('&')
			}&status=${status}`
		}
	}

	const node = create(params);
	if (node) {
		messages.push(`Created synonym ${from}.`);
	} else {
		messages.push(`Something went wrong when trying to create synonym ${from}!`);
		status = 500;
	}
	return {
		redirect: `${TOOL_PATH}/thesauri/edit/${thesaurusName}?${
			messages.map(m => `messages=${m}`).join('&')
		}&status=${status}`
	}
} // handlePost
