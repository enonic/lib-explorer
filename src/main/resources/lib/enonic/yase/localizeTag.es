//import {toStr} from '/lib/enonic/util';
//import {getLocale} from '/lib/xp/admin';

import {
	BRANCH_ID,
	PATH_TAG,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {cachedNode} from '/lib/enonic/yase/cachedNode';


export function localizeTag({
	//locale = getLocale(),
	nodeCache,
	tag
}) {
	//log.info(toStr({locale, tag}));
	const nodePath = `${PATH_TAG}/${tag}`;
	const tagNode = cachedNode({
		cache: nodeCache,
		repoId: REPO_ID,
		branch: BRANCH_ID,
		id: nodePath
	});
	//log.info(toStr({tagNode}));
	const {displayName} = tagNode;
	//log.info(toStr({locale, tag, displayName}));
	return displayName;
} // function localizeTag
