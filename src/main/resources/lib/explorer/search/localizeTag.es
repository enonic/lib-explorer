//import {toStr} from '/lib/util';
//import {getLocale} from '/lib/xp/admin';

import {
	BRANCH_ID_EXPLORER,
	REPO_ID_EXPLORER
} from '/lib/explorer/model/2/constants';
import {cachedNode} from '/lib/explorer/search/cachedNode';


export function localizeTag({
	//locale = getLocale(),
	nodeCache,
	parentPath,
	name
}) {
	//log.info(toStr({locale, path}));
	const nodePath = `${parentPath}/${name}`;
	let tagNode = {displayName: name.replace(/.+\//,'')};
	try {
		tagNode = cachedNode({
			cache: nodeCache,
			repoId: REPO_ID_EXPLORER,
			branch: BRANCH_ID_EXPLORER,
			id: nodePath
		});
	} catch (e) {
		log.error(`Could not find node ${REPO_ID_EXPLORER}:${BRANCH_ID_EXPLORER}:${nodePath}`);
	}
	//log.info(toStr({tagNode}));
	const {displayName} = tagNode;
	//log.info(toStr({locale, tag, displayName}));
	return displayName;
}
