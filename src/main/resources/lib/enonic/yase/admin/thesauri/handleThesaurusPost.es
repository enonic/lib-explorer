import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {thesaurusPage} from '/lib/enonic/yase/admin/thesauri/thesaurusPage';
import {create} from '/lib/enonic/yase/node/create';
import {modify} from '/lib/enonic/yase/node/modify';
import {toStr} from '/lib/enonic/util';
import {synonym} from '/lib/enonic/yase/nodeTypes/synonym';

export function handleThesaurusPost({
	params: {
		from = '',
		id,
		to = ''
	},
	path
}) {
	const _parentPath = path.replace(TOOL_PATH, '');
	log.info(toStr({
		from, id, to, path, _parentPath
	}));
	const params = synonym({
		_parentPath,
		from,
		to
	});

	if (id) {
		params.key = id;
		const node = modify(params);
		return thesaurusPage({
			messages: node
				? [`Updated synonym ${from}.`]
				: [`Something went wrong when trying to update synonym ${from}!`],
			path,
			status: node ? 200 : 500
		});
	}

	const node = create(params);
	return thesaurusPage({
		messages: node
			? [`Created synonym ${from}.`]
			: [`Something went wrong when trying to create synonym ${from}!`],
		path,
		status: node ? 200 : 500
	});
}
