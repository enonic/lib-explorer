import type {
	JournalInterface,
	JournalMessage,
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
	name: string
	startTime: number
	public errors: JournalMessage[]
	public informations: JournalMessage[]
	public successes: JournalMessage[]
	public warnings: JournalMessage[]

	constructor({
		name,
		startTime
	}) {
		if (!name) { throw new Error('Missing required parameter name!'); }
		if (!startTime) { throw new Error('Missing required parameter startTime!'); }
		this.name = name;
		this.startTime = startTime;
		this.errors = [];
		this.informations = [];
		this.successes = [];
		this.warnings = [];
	} // constructor

	addError({message}: JournalMessage) {
		if (!(message)) { throw new Error('addError: Missing required parameter message!'); }
		this.errors.push({message});
	}

	addInformation({message}: JournalMessage) {
		if (!(message)) { throw new Error('addError: Missing required parameter message!'); }
		this.informations.push({message});
	}

	addSuccess({message}: JournalMessage) {
		if (!(message)) { throw new Error('addSuccess: Missing required parameter message!'); }
		this.successes.push({message});
	}

	addWarning({message}: JournalMessage) {
		if (!(message)) { throw new Error('addWarning: Missing required parameter message!'); }
		this.warnings.push({message});
	}

	create() {
		maybeCreateRepoAndBranch({repoId: REPO_JOURNALS});
		createNode(
			journal({
				errors: this.errors,
				informations: this.informations,
				name: this.name,
				startTime: this.startTime,
				successes: this.successes,
				warnings: this.warnings,
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
