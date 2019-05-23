import {
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_YASE_READ
} from '/lib/explorer/constants';
import {connect} from '/lib/explorer/repo/connect';


export function connectToCollection(name) {
	return connect({
		repoId: `${COLLECTION_REPO_PREFIX}${name}`,
		principals: [PRINCIPAL_YASE_READ]
	});
}
