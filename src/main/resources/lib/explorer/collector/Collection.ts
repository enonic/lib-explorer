import type {WriteConnection} from '../node/WriteConnection.d';

import {
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_EXPLORER_WRITE
} from '/lib/explorer/constants';
import {maybeCreate as maybeCreateRepoAndBranch} from '../repo/maybeCreate';
import {connect} from '../repo/connect';


export class Collection {
	connection :WriteConnection
	repoId :string

	constructor({
		name
	}) {
		if (!name) { throw new Error('Missing required parameter name!'); }
		this.repoId = `${COLLECTION_REPO_PREFIX}${name}`;
		maybeCreateRepoAndBranch({repoId: this.repoId});
		this.connection = connect({
			repoId: this.repoId,
			branch: 'master',
			principals: [PRINCIPAL_EXPLORER_WRITE]
		});
	} // constructor
} // class Collection
