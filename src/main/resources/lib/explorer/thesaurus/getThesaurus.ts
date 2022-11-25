import type {RepoConnection} from '/lib/xp/node';
import type {ThesaurusNode} from '/lib/explorer/types/Thesaurus.d';


import {
	FOLDER_THESAURI,
	NT_THESAURUS
} from '/lib/explorer/constants';
import {coerceThesaurus} from '/lib/explorer/thesaurus/coerceThesaurus';


export function getThesaurus({
	// Required
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	// Optional
	_id: idParam,
	_name: nameParam
} :{
	// Required
	connection: RepoConnection
	// Optional
	_id?: string
	_name?: string
}) {
	const key = idParam || (nameParam ? `/${FOLDER_THESAURI}/${nameParam}` : null);
	if (!key) {
		throw new Error('getThesaurus(): Missing required named parameter _id or _name!');
	}

	const node = connection.get<ThesaurusNode>(key);
	if (!node) {
		const msg = `Unable to get thesaurus with _id:${idParam} or _name:${nameParam}`;
		log.error(msg);
		throw new Error(msg);
	}

	const {
		_id,
		_path,
		_nodeType
	} = node;
	if (_nodeType !== NT_THESAURUS) {
		log.error(`getThesaurus: Node with id:${_id} and _path:${_path} is not a thesaurus! rather _nodeType:${_nodeType}`);
		throw new Error(`getThesaurus: Node with key:${key} is not a thesaurus!`);
	}

	return coerceThesaurus(node);
}
