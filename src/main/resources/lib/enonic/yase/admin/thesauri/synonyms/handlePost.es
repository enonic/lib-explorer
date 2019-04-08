import {
	PRINCIPAL_YASE_WRITE,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {create} from '/lib/enonic/yase/node/create';
import {modify} from '/lib/enonic/yase/node/modify';
//import {toStr} from '/lib/enonic/util';
import {synonym} from '/lib/enonic/yase/nodeTypes/synonym';
import {connect} from '/lib/enonic/yase/repo/connect';


export function handlePost({
	params: {
		from = '',
		to = '',
		typedThesaurusName = ''
	},
	path
}) {
	const relPath = path.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	//const action = pathParts[1]; // synonyms
	const thesaurusName = pathParts[2];
	const secondaryAction = pathParts[3]; // create delete update
	const synonymName = pathParts[4];
	/*log.info(toStr({
		path, relPath, pathParts, thesaurusName, secondaryAction, synonymName, from, to
	}));*/

	const connection = connect({
		principals: [PRINCIPAL_YASE_WRITE]
	});

	const messages = [];
	let status = 200;

	if (secondaryAction === 'delete') {
		if (!typedThesaurusName) {
			messages.push('Missing required parameter "typedThesaurusName"!');
			status = 400;
		} else if (typedThesaurusName !== thesaurusName) {
			messages.push(`Typed thesaurus name: "${typedThesaurusName}" doesn't match actual thesaurus name: "${thesaurusName}"!`);
			status = 400;
		} else {
			const nodePath = `/thesauri/${thesaurusName}/${synonymName}`;
			const deleteRes = connection.delete(nodePath);
			if(deleteRes) {
				messages.push(`Synonym with path:${nodePath} deleted.`)
			} else {
				messages.push(`Something went wrong when trying to delete synonym with path:${nodePath}.`)
				status = 500;
			}
		}
	} else {
		const params = synonym({
			__connection: connection,
			_parentPath: `/thesauri/${thesaurusName}`,
			from,
			to
		});
		//log.info(toStr({params}));
		if (secondaryAction === 'create') {
			const node = create(params);
			if (node) {
				messages.push(`Created synonym ${from}.`);
			} else {
				messages.push(`Something went wrong when trying to create synonym ${from}!`);
				status = 500;
			}
		} else if (secondaryAction === 'update' && synonymName) {
			params._name = synonymName;
			const node = modify(params);
			if (node) {
				messages.push(`Updated synonym ${from}.`);
			} else {
				messages.push(`Something went wrong when trying to update synonym ${from}!`);
				status = 500;
			}
		}
	}

	return {
		redirect: `${TOOL_PATH}/thesauri/edit/${thesaurusName}?${
			messages.map(m => `messages=${m}`).join('&')
		}&status=${status}`
	}
} // handlePost
