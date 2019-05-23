//import {toStr} from '/lib/util';
//import {getLocale} from '/lib/xp/admin';

import {
	BRANCH_ID,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {cachedNode} from '/lib/enonic/yase/search/cachedNode';


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
			repoId: REPO_ID,
			branch: BRANCH_ID,
			id: nodePath
		});
	} catch (e) {
		log.error(`Could not find node ${REPO_ID}:${BRANCH_ID}:${nodePath}`);
	}
	//log.info(toStr({tagNode}));
	const {displayName} = tagNode;
	//log.info(toStr({locale, tag, displayName}));
	return displayName;
}
