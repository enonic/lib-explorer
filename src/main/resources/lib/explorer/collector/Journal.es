import {
	REPO_JOURNALS,
	PRINCIPAL_EXPLORER_WRITE
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {create} from '/lib/explorer/node/create';
import {maybeCreate as maybeCreateRepoAndBranch} from '/lib/explorer/repo/maybeCreate';
import {journal} from '/lib/explorer/model/2/nodeTypes/journal';


export class Journal {

  constructor({
    name,
    startTime
  }) {
		if (!name) { throw new Error('Missing required parameter name!'); }
		if (!startTime) { throw new Error('Missing required parameter startTime!'); }
    this.name = name;
    this.startTime = startTime;
    this.errors = [];
    this.successes = []
  } // constructor

  addError({uri, message}) {
		if (!(uri || message)) { throw new Error('addError: Missing required parameter uri or message!'); }
    this.errors.push({uri, message});
  }

	addSuccess({uri, message}) {
		if (!(uri || message)) { throw new Error('addSuccess: Missing required parameter uri or message!'); }
		this.successes.push({uri, message});
	}

  create() {
		maybeCreateRepoAndBranch({repoId: REPO_JOURNALS});
    this.__connection = connect({
  		repoId: REPO_JOURNALS,
  		branch: 'master',
  		principals: [PRINCIPAL_EXPLORER_WRITE]
  	});
		create(journal(this));
  } // create

} // class Journal
