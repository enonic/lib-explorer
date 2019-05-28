import {
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';


export function connectToCollection(name) {
	return connect({
		repoId: `${COLLECTION_REPO_PREFIX}${name}`,
		principals: [PRINCIPAL_EXPLORER_READ]
	});
}
