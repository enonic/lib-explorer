//import {toStr} from '/lib/util';
import {connect} from '/lib/explorer/repo/connect';
import {query} from '/lib/explorer/connection/query';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
import {create} from '/lib/explorer/node/create';
import {exists} from '/lib/explorer/node/exists';


import {
	NT_STOP_WORDS as OLD_NT_STOP_WORDS,
	PRINCIPAL_YASE_READ,
	REPO_ID as REPO_YASE,
	BRANCH_ID as REPO_YASE_BRANCH,
	USER_YASE_JOB_RUNNER_NAME,
	USER_YASE_JOB_RUNNER_USERSTORE
} from '/lib/explorer/model/1/constants';


import {
	PRINCIPAL_EXPLORER_WRITE,
	REPO_ID_EXPLORER,
	BRANCH_ID_EXPLORER,
	USER_EXPLORER_APP_NAME,
	USER_EXPLORER_APP_ID_PROVIDER
} from '/lib/explorer/model/2/constants';

import {stopwords as stopwordsModel} from '/lib/explorer/model/2/index';


export function stopwords() {
	const readFromOldConnection = connect({
		repoId: REPO_YASE,
		branch: REPO_YASE_BRANCH,
		principals: [PRINCIPAL_YASE_READ],
		user: {
			login: USER_YASE_JOB_RUNNER_NAME,
			idProvider: USER_YASE_JOB_RUNNER_USERSTORE
		}
	});
	const oldRes = query({
		connection: readFromOldConnection,
		filters: addFilter({
			filter: hasValue('type', [OLD_NT_STOP_WORDS])
		})
	});

	const writeToNewConnection = connect({
		repoId: REPO_ID_EXPLORER,
		branch: BRANCH_ID_EXPLORER,
		principals: [PRINCIPAL_EXPLORER_WRITE],
		user: {
			login: USER_EXPLORER_APP_NAME,
			idProvider: USER_EXPLORER_APP_ID_PROVIDER
		}
	});
	oldRes.hits.forEach(node => {
		if (!exists({
			connection: writeToNewConnection,
			_path: node._path
		})) {
			//log.info(toStr({node}));
			node.__connection = writeToNewConnection;
			node = stopwordsModel(node);
			//log.info(toStr({node}));
			create(node);
		}
	});
} // stopwords
