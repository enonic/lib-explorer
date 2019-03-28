//import {toStr} from '/lib/enonic/util';
import {isString} from '/lib/enonic/util/value';

import {
	//getMultipartForm,
	getMultipartText
} from '/lib/xp/portal';

import {NT_THESAURUS, TOOL_PATH} from '/lib/enonic/yase/constants';
import {listThesauriPage} from '/lib/enonic/yase/admin/thesauri/listThesauriPage';
import {thesaurusPage} from '/lib/enonic/yase/admin/thesauri/thesaurusPage';
import {createOrModify} from '/lib/enonic/yase/node/createOrModify';
import {parseCsv} from '/lib/enonic/yase/parseCsv';

import {synonym} from '/lib/enonic/yase/nodeTypes/synonym';


export function handleThesauriPost(req) {
	const {
		params: {
			description,
			name,
			thesaurus
		},
		path
	} = req;
	//log.info(toStr({req}));

	if (name && description) {
		const node = createOrModify({
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
		columns: ['from', 'to'],
		start: 1 // Aka skip line 0
	}).forEach(({from, to}) => {
		//log.info(toStr({from, to}));
		if (
			from // Skip empty cells
			&& to // Skip empty cells
			&& isString(from) && from.trim() // Skip cells with just whitespace, emptystring is Falsy
			&& isString(to) && to.trim() // Skip cells with just whitespace, emptystring is Falsy
		) { // Skip empty values
			const fromArr = from.trim().split(',').map(str => str.trim());
			const toArr = to.trim().split(',').map(str => str.trim());
			const params = synonym({
				_parentPath: `/thesauri/${thesaurus}`,
				from: fromArr.length > 1 ? fromArr : fromArr.join(),
				to: toArr.length > 1 ? toArr : toArr.join()
			});
			//log.info(toStr({params}));
			createOrModify(params);
		}
	});
	return thesaurusPage({
		messages: [`Imported synonyms to ${thesaurus}.`],
		page: `${TOOL_PATH}/thesauri/${thesaurus}`
	});
}
