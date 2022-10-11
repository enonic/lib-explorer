import {toStr} from '@enonic/js-utils';
import {copy} from '/lib/explorer/repo/copy';
import {
	delete as deleteRepo,
	deleteBranch,
	get as getRepo
} from '/lib/xp/repo';

// We could make this function copy all the branches of a repo, but a repo
// typically only have a single branch, so let's leave that complexity for later
export function rename({
	fromRepoId,
	toRepoId,
	// Optional
	branchId = 'master'
}: {
	fromRepoId :string
	toRepoId :string
	// Optional
	branchId ?:string
}) {
	const {
		created,
		createErrors,
		getErrors
	} = copy({
		fromRepoId,
		toRepoId,
		branchId
	});
	if (createErrors || getErrors) {
		throw new Error(`repo.rename: Aborting due to: getErrors:${getErrors} createErrors:${createErrors}!`);
	}

	const rv = {
		createdNodes: created,
		deletedBranches: 0,
		deletedRepos: 0
	}

	// What happens if one deletes the last branch in a repo?
	// java.lang.IllegalArgumentException: branches must contain master branch
	if (branchId === 'master') {
		const fromRepo = getRepo(fromRepoId);
		const {
			branches: fromRepoBranches
		} = fromRepo;
		if (fromRepoBranches.length === 1) {
			const deleteRepoRes = deleteRepo(fromRepoId);
			if (deleteRepoRes) {
				rv.deletedRepos = 1;
			} else {
				throw new Error(`repo.rename: Unable to delete repo:${fromRepoId}!`);
			}
		} else if (fromRepoBranches.length > 1) {
			// TODO delete all the copied nodes?
		} else {
			throw new Error(`repo.rename: This should never happen? fromRepo:${toStr(fromRepo)}`);
		}
	} else { // branchId !== 'master'
		try {
			deleteBranch({
				branchId,
				repoId: fromRepoId
			});
		} catch (e) {
			log.error('Stacktrace:', e);
			throw new Error(`repo.rename: Unable to delete branch:${branchId} fromRepoId:${fromRepoId}`);
		}
		rv.deletedBranches = 1;
	}

	return rv;
}
