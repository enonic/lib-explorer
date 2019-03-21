import {COLLECTION_REPO_PREFIX} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';


export function connectToCollection(name) {
	return connectRepo({
		repoId: `${COLLECTION_REPO_PREFIX}${name}`
	});
}
