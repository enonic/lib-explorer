//import {toStr} from '/lib/enonic/util';
//import {getLocale} from '/lib/xp/admin';

import {
	BRANCH_ID,
	//PATH_TAG,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {cachedNode} from '/lib/enonic/yase/cachedNode';


export function localizeTag({
	//locale = getLocale(),
	nodeCache,
	tag: path
}) {
	//log.info(toStr({locale, path}));
	//const nodePath = `${PATH_TAG}/${tag}`;
	let tagNode = {displayName: path.replace(/.+\//,'')};
	try {
		tagNode = cachedNode({
			cache: nodeCache,
			repoId: REPO_ID,
			branch: BRANCH_ID,
			id: path
		});
	} catch (e) {
		log.error(`Could not find node ${REPO_ID}:${BRANCH_ID}:${path}`);
	}
	//log.info(toStr({tagNode}));
	const {displayName} = tagNode;
	//log.info(toStr({locale, tag, displayName}));
	return displayName;
} // function localizeTag
