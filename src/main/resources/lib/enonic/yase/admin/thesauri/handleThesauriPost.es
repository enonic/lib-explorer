import {toStr} from '/lib/enonic/util';
//import {readLines} from '/lib/xp/io';
import {
	//getMultipartForm,
	//getMultipartStream,
	getMultipartText
} from '/lib/xp/portal';

import {NT_THESAURUS} from '/lib/enonic/yase/constants';
import {listThesauriPage} from '/lib/enonic/yase/admin/thesauri/listThesauriPage';
import {createOrModifyNode} from '/lib/enonic/yase/createOrModifyNode';
import {parseCsv} from '/lib/enonic/yase/parseCsv';


export function handleThesauriPost(req) {
	const {
		params: {
			description,
			name
		},
		path
	} = req;
	log.info(toStr({req}));

	if (name && description) {
		const node = createOrModifyNode({
			_parentPath: '/thesauri',
			_name: name,
			_indexConfig: {
				default: 'byType'
			},
			description,
			displayName: name,
			type: NT_THESAURUS
		});
		return listThesauriPage({
			messages: node
				? [`Saved thesauri named ${name}.`]
				: [`Something went wrong when trying to save thesauri named ${name}!`],
			path,
			status: node ? 200 : 500
		});
	}

	//const form = getMultipartForm(); log.info(toStr({form}));

	const text = getMultipartText('file'); //log.info(toStr({text}));
	parseCsv({
		csvString: text,
		columns: ['first', null],
		map: ({first, second}, i) => {
			log.info(toStr({first, second, i}));
			return {second: first};
		},
		forEach: ({first, second}, i) => {
			log.info(toStr({first, second, i}));
		},
		start: 1 // Aka skip line 0
	});

	//const stream = getMultipartStream('file');

	return {
		body: {},
		contentType: 'text/json;charset=utf-8'
	};
}
