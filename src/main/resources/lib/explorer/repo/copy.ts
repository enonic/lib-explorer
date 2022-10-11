import type {
	CreateNodeParams,
	Node
} from '/lib/xp/node'

import {
	connect
} from '/lib/xp/node';
import {
	create as createRepo,
	createBranch,
	get as getRepo
} from '/lib/xp/repo';
import {
	PRINCIPAL_ROLE_SYSTEM_ADMIN//,
	// toStr
} from '@enonic/js-utils';
import {
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/constants'
import {dirname} from '/lib/explorer/path/dirname'


const ROOT_NODE_ID = '000-000-000-000';


// We could make this function copy all the branches of a repo, but a repo
// typically only have a single branch, so let's leave that complexity for later
export function copy({
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
	//──────────────────────────────────────────────────────────────────────────
	// Check params
	//──────────────────────────────────────────────────────────────────────────
	if (!fromRepoId) {
		throw new Error(`repo.copy: Missing required parameter fromRepoId!`)
	}
	if (!toRepoId) {
		throw new Error(`repo.copy: Missing required parameter toRepoId!`)
	}

	//──────────────────────────────────────────────────────────────────────────
	// Check and create repos/branches
	//──────────────────────────────────────────────────────────────────────────
	const fromRepo = getRepo(fromRepoId);
	if (!fromRepo) {
		throw new Error(`repo.copy: Unable to get repo with id:${fromRepoId}`);
	}
	const {
		branches: fromRepoBranches
	} = fromRepo;
	if (!fromRepoBranches.includes(branchId)) {
		throw new Error(`repo.copy: fromRepo with id:${fromRepoId} doesn't have a branch:${branchId}!`);
	}

	let toRepo = getRepo(toRepoId);
	if (toRepo) {
		log.warning(`repo.copy: toRepo with id:${toRepoId} already exists!`);
		//throw new Error(`repo.copy: toRepo with id:${toRepoId} already exists!`);
		const {
			branches: toRepoBranches
		} = toRepo;
		if (toRepoBranches.includes(branchId)) {
			// TODO this could be a warning instead
			throw new Error(`repo.copy: fromRepo with id:${fromRepoId} already has a branch named ${branchId}!`);
		}
	} else {
		toRepo = createRepo({ // This should create a repo with a master branch
			id: toRepoId
		});
		if (!toRepo) {
			throw new Error(`repo.copy: Unable to create a repo with id:${toRepoId}!`);
		}
		// if (branchId !== 'master') {
		// 	createBranch({
		// 		branchId,
		// 		repoId: toRepoId
		// 	});
		// }
	}
	const {
		branches: toRepoBranches
	} = toRepo;
	if (!toRepoBranches.includes(branchId)) {
		try {
			createBranch({
				branchId,
				repoId: toRepoId
			});
		} catch (e) {
			throw new Error(`repo.copy: Unable to create branch ${branchId} in repo:${toRepoId}!`);
		}
	}

	//──────────────────────────────────────────────────────────────────────────
	// Connect to the repos
	//──────────────────────────────────────────────────────────────────────────
	const fromRepoReadConnection = connect({
		branch: branchId,
		repoId: fromRepoId,
		principals: [PRINCIPAL_EXPLORER_READ]
	});

	const toRepoWriteConnection = connect({
		branch: branchId,
		repoId: toRepoId,
		principals: [PRINCIPAL_ROLE_SYSTEM_ADMIN]
	});

	//──────────────────────────────────────────────────────────────────────────
	// Copy (overwrite) the root node
	//──────────────────────────────────────────────────────────────────────────
	const fromRootNode = fromRepoReadConnection.get(ROOT_NODE_ID) as Node;
	if (!fromRootNode) {
		throw new Error(`repo.copy: Root node doesn't exist on branch:${branchId} in fromRepo:${fromRepoId}`);
	}

	if (!toRepoWriteConnection.exists(ROOT_NODE_ID)) {
		throw new Error(`repo.copy: Root node doesn't exist on branch:${branchId} in toRepo:${toRepoId}`);
	}
	// const modifiedToRepoRootNode =
	toRepoWriteConnection.modify({
		key: ROOT_NODE_ID,
		editor: () => {
			return fromRootNode;
		}
	});
	// TODO deepEqual(fromRootNode, modifiedToRepoRootNode)?

	//──────────────────────────────────────────────────────────────────────────
	// Copy (create) all the other nodes
	// You cannot create a child before it's parent, so this has to be done in some order
	// TODO: Since the number of nodes can be huge, paginate?
	//──────────────────────────────────────────────────────────────────────────
	const nodeIds = fromRepoReadConnection.query({
		count: -1,
		query: {
			boolean: {
				should: [{
					matchAll: {}
				}],
				mustNot: [{
					// term: {
					// 	field: '_path',
					// 	value: `/${ROOT_NODE_ID}`
					// }
					term: {
						field: '_id',
						value: ROOT_NODE_ID
					}
				}]
			}
		},
		sort: {
			direction: 'ASC',
			field: '_path'
		}
	}).hits.map(({id}) => id);

	const rv = {
		created: 0,
		createErrors: 0,
		getErrors: 0
	};
	for (let i = 0; i < nodeIds.length; i++) {
		const nodeId = nodeIds[i];
		const fromNode = fromRepoReadConnection.get(nodeId) as Node;
		if (!fromNode) {
			log.error(`repo.copy: Unable to get node:${nodeId} on branch:${branchId} in fromRepo:${fromRepoId}, ignoring...`);
			rv.getErrors += 1;
		} else {
			const _parentPath = dirname(fromNode._path);
			// log.debug('repo.copy: _path:%s _parentPath:%s', fromNode._path, _parentPath);
			delete fromNode._id;
			delete fromNode._path;
			const createNodeParams = JSON.parse(JSON.stringify(fromNode)) as CreateNodeParams;
			createNodeParams._parentPath = _parentPath;
			// log.debug('repo.copy: createNodeParams:%s', toStr(createNodeParams));
			const createdNode =	toRepoWriteConnection.create(createNodeParams);
			if (!createdNode) {
				rv.createErrors += 1;
			} else {
				rv.created += 1;
				// TODO deepEqual(fromNode, createdNode)?
			}
		}
	} // for nodeIds
	toRepoWriteConnection.refresh();

	return rv;
} // copy
