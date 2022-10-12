import type {RepoConnection} from '/lib/xp/node';


import {
	setIn,
	toStr
} from '@enonic/js-utils';
import {
	COLLECTION_REPO_PREFIX,
	FIELD_PATH_META,
	NT_DOCUMENT,
	PATH_COLLECTIONS
} from '/lib/explorer/constants';
import {rename as renameRepo} from '/lib/explorer/repo/rename';
import {runAsSu} from '/lib/explorer/runAsSu';
import {executeFunction} from '/lib/xp/task';


const FIELD_PATH_META_COLLECTION = `${FIELD_PATH_META}.collection`;


export function rename({
	fromName,
	toName,
	writeConnection
} :{
	fromName :string
	toName :string
	writeConnection :RepoConnection
}) {
	const fromPath = `${PATH_COLLECTIONS}/${fromName}`;
	const moveParams = {
		source: fromPath,
		target: toName
	};
	//log.debug(`moveParams:${toStr({moveParams})}`);
	const boolMoved = writeConnection.move(moveParams);
	if (!boolMoved) {
		throw new Error(`collection.rename: Unable to move/rename _path:${fromPath} to _name:${toName}!`);
	}
	writeConnection.refresh(); // So the data becomes immidiately searchable

	const fromRepoId = `${COLLECTION_REPO_PREFIX}${fromName}`;
	const toRepoId = `${COLLECTION_REPO_PREFIX}${toName}`;
	executeFunction({
		description: `Renaming repo ${fromRepoId} -> ${toRepoId}`,
		func: () => {
			runAsSu(() => {
				const rv = renameRepo({
					fromRepoId,
					toRepoId,
					editor: (node) => {
						// log.debug(`collection.rename: editor node:%s`, toStr(node));
						if (node._nodeType === NT_DOCUMENT) {
							setIn(node, FIELD_PATH_META_COLLECTION, toName);
							// log.debug(`collection.rename: editor modified node:%s`, toStr(node));
						}
						return node;
					} // editor
				});
				log.info('Renaming repo %s -> %s status:%s', fromRepoId, toRepoId, toStr(rv));
			});
		}
	});
}
