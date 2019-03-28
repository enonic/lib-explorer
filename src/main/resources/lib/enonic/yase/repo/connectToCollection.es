import {COLLECTION_REPO_PREFIX} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';


export function connectToCollection(name) {
	return connect({
		repoId: `${COLLECTION_REPO_PREFIX}${name}`
	});
}
