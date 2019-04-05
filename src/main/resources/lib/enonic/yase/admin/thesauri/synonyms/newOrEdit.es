import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';

import {
	PRINCIPAL_YASE_READ,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {connect} from '/lib/enonic/yase/repo/connect';
import {form} from '/lib/enonic/yase/admin/thesauri/synonyms/form';


export function newOrEdit({
	path
}) {
	const relPath = path.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	//const action = pathParts[1]; // synonyms
	const thesaurusName = pathParts[2];
	const secondaryAction = pathParts[3]; // new || edit
	const synonymName = pathParts[4];
	log.info(toStr({
		path, relPath, pathParts, thesaurusName, secondaryAction, synonymName
	}));

	if(secondaryAction === 'new') {
		return htmlResponse({
			main: `${form({thesaurusName})}`,
			path,
			title: 'New synonym'
		});
	}

	const connection = connect({
		principals: [PRINCIPAL_YASE_READ]
	});
	const node = connection.get(`/thesauri/${thesaurusName}/${synonymName}`);
	log.info(toStr({node}));

	const {displayName, from, to} = node;
	log.info(toStr({displayName, from, to}));

	return htmlResponse({
		main: `${form({
			thesaurusName,
			synonymName,
			displayName,
			from,
			to,
			path,
			title: `Edit synonym ${displayName}`
		})}`
	});
} // newOrEdit
