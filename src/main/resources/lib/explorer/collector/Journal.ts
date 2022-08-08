import type {
	Journal as JournalInterface,
	JournalError,
	JournalSuccess,
	WriteConnection
} from '/lib/explorer/types/index.d';


import {
	REPO_JOURNALS,
	PRINCIPAL_EXPLORER_WRITE
} from '/lib/explorer/constants';
import {connect} from '../repo/connect';
import {create as createNode} from '../node/create';
import {maybeCreate as maybeCreateRepoAndBranch} from '../repo/maybeCreate';
import {journal} from '../model/2/nodeTypes/journal';


export class Journal implements JournalInterface {
	name :string
	startTime :number
	public errors :Array<JournalError>
	public successes :Array<JournalSuccess>

	constructor({
		name,
		startTime
	}) {
		if (!name) { throw new Error('Missing required parameter name!'); }
		if (!startTime) { throw new Error('Missing required parameter startTime!'); }
		this.name = name;
		this.startTime = startTime;
		this.errors = [];
		this.successes = [];
	} // constructor

	addError({message} :JournalError) {
		if (!(message)) { throw new Error('addError: Missing required parameter message!'); }
		this.errors.push({message});
	}

	addSuccess({message} :JournalSuccess) {
		if (!(message)) { throw new Error('addSuccess: Missing required parameter message!'); }
		this.successes.push({message});
	}

	create() {
		maybeCreateRepoAndBranch({repoId: REPO_JOURNALS});
		createNode(
			journal({
				errors: this.errors,
				name: this.name,
				startTime: this.startTime,
				successes: this.successes
			}),
			{
				connection: connect({
					repoId: REPO_JOURNALS,
					branch: 'master',
					principals: [PRINCIPAL_EXPLORER_WRITE]
				}) as WriteConnection
			}
		);
	} // create

} // class Journal
