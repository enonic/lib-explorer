import {
	COLLECTION_REPO_PREFIX,
	NT_API_KEY,
	PRINCIPAL_EXPLORER_READ,
	PRINCIPAL_EXPLORER_WRITE/*,
	ROLE_EXPLORER_ADMIN,
	ROLE_EXPLORER_WRITE,
	ROLE_SYSTEM_ADMIN*/
} from '/lib/explorer/model/2/constants';
import {USER as EXPLORER_APP_USER} from '/lib/explorer/model/2/users/explorer';
//import {Document} from '/lib/explorer/model/2/nodeTypes/document';
//import {get as getCollection} from '/lib/explorer/collection/get';
//import {createOrModify} from '/lib/explorer/node/createOrModify';
import {connect} from '/lib/explorer/repo/connect';
import {maybeCreate as maybeCreateRepoAndBranch} from '/lib/explorer/repo/maybeCreate';
import {runAsSu} from '/lib/explorer/runAsSu';
import {hash} from '/lib/explorer/string/hash';
import {create} from '/lib/explorer/document/create';
import {update} from '/lib/explorer/document/update';
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {
	getUser/*,
	hasRole*/
} from '/lib/xp/auth';
import {run} from '/lib/xp/context';


function createDocument({
	connection,
	idField,
	responseArray,
	toPersist
}) {
	toPersist.__connection = connection;
	const createdNode = create(toPersist);
	if(createdNode) {
		const responseNode = {};
		if (idField) {
			responseNode[idField] = createdNode[idField];
		} else {
			responseNode._id = createdNode._id;
		}
		responseArray.push(responseNode);
	} else {
		responseArray.push({
			error: 'Something went wrong when trying to create the document!'
		});
	}
}

function modifyDocument({
	connection,
	id,
	idField,
	responseArray,
	toPersist//,
	//user
}) {
	toPersist.__connection = connection;
	toPersist._id = id;
	const updatedNode = update(toPersist);
	//log.info(`updatedNode:${toStr(updatedNode)}`);
	if(updatedNode) {
		const responseNode = {};
		if (idField) {
			responseNode[idField] = updatedNode[idField];
		} else {
			responseNode._id = updatedNode._id;
		}
		responseArray.push(responseNode);
	} else {
		responseArray.push({
			error: 'Something went wrong when trying to modify the document!'
		});
	}
}


export function post(request) {
	//const user = getUser();
	//log.info(`user:${toStr(user)}`);

	/*if (!(
		hasRole(ROLE_SYSTEM_ADMIN)
		|| hasRole(ROLE_EXPLORER_ADMIN)
		|| hasRole(ROLE_EXPLORER_WRITE)
	)) {
		return {
			status: 403
		};
	}*/

	const {
		body,
		params: {
			apiKey = '',
			//branch = branchDefault,
			collection: collectionParam = ''
		} = {},
		pathParams: {
			collection: collectionName = collectionParam
		} = {}
	} = request;
	//log.info(`body:${toStr(body)}`);
	//log.info(`params:${toStr(params)}`);

	//const d = new Date();
	//const branchDefault = `${d.getFullYear()}_${d.getMonth()+1}_${d.getDate()}T${d.getHours()}_${d.getMinutes()}_${d.getSeconds()}`;

	//log.info(`apiKey:${toStr(apiKey)}`);
	//log.info(`branch:${toStr(branch)}`);
	//log.info(`collectionName:${toStr(collectionName)}`);

	if (!collectionName) {
		return {
			body: {
				message: 'Missing required parameter collection!'
			},
			contentType: 'text/json;charset=utf-8',
			status: 400 // Bad Request
		};
	}
	if (!apiKey) {
		return {
			body: {
				message: 'Missing required url query parameter apiKey!'
			},
			contentType: 'text/json;charset=utf-8',
			status: 400 // Bad Request
		};
	}

	// Cases:
	// 1. Collection does not exist, thus no apiKey either.
	//    So no one can fish for exisiting collections simply respond 400.
	//
	// 2. Collection does exist, but no matching apiKey exists.
	//    So no one can fish for exisiting collections simply respond 400.
	//
	// 3. Collection exist and apiKey matches.
	//    Create or update documents.
	//    TODO: What about removing old documents?
	//
	// 4. apiKey matches in a different collection
	//    We could have been nice and said, wrong or typo in collection name
	//    but for same reasons as 2, letting 2 handle this is the best.

	const readConnection = connect({
		principals: [PRINCIPAL_EXPLORER_READ]
	});

	/*const collection = getCollection({
		connection: readConnection,
		name: collectionName
	});
	//log.info(`collection:${toStr(collection)}`);

	if (!collection) {
		return {
			body: {
				message: 'Bad Request'
			},
			contentType: 'text/json;charset=utf-8',
			status: 400 // Bad Request
		};
	}*/

	const hashedApiKey = hash(apiKey);
	//log.info(`hashedApiKey:${toStr(hashedApiKey)}`);


	const matchingApiKeys = readConnection.query({
		count: -1,
		filters: {
			boolean: {
				must: [{
					hasValue: {
						field: 'type',
						values: [NT_API_KEY]
					}
				},{
					hasValue: {
						field: 'key',
						values: [hashedApiKey]
					}
				}]
			}
		}
	});
	//log.info(`matchingApiKeys:${toStr(matchingApiKeys)}`);
	if(matchingApiKeys.total !== 1) {
		log.error(`API key hashedApiKey:${hashedApiKey} not found!`);
		return {
			body: {
				message: 'Bad Request'
			},
			contentType: 'text/json;charset=utf-8',
			status: 400 // Bad Request
		};
	}

	const apiKeyNodeId = matchingApiKeys.hits[0].id;
	const apiKeyNode = readConnection.get(apiKeyNodeId);
	//log.info(`apiKeyNode:${toStr(apiKeyNode)}`);

	if (!apiKeyNode) { // This should never happen (index out of sync)
		log.error(`API key hashedApiKey:${hashedApiKey} found, but unable to get id:${apiKeyNodeId}!`);
		return {
			body: {
				message: 'Bad Request'
			},
			contentType: 'text/json;charset=utf-8',
			status: 400 // Bad Request
		};
	}

	if (!apiKeyNode.collections) {
		log.error(`API key hashedApiKey:${hashedApiKey} found, but access too no collections!`);
		return {
			body: {
				message: 'Bad Request'
			},
			contentType: 'text/json;charset=utf-8',
			status: 400 // Bad Request
		};
	}

	if (!forceArray(apiKeyNode.collections).includes(collectionName)) {
		log.error(`API key hashedApiKey:${hashedApiKey} does not have access to collection:${collectionName}!`);
		return {
			body: {
				message: 'Bad Request'
			},
			contentType: 'text/json;charset=utf-8',
			status: 400 // Bad Request
		};
	}

	/*const {
		collector: {
			config: {
				apiKeys = []
			} = {}
		} = {}
	} = collection;

	const arrApiKeys = forceArray(apiKeys);
	let keyMatch = false;
	for (let i = 0; i < arrApiKeys.length; i++) {
		const {key} = arrApiKeys[i];
		//log.info(`key:${toStr(key)}`);
		if(key === hashedApiKey) {
			keyMatch = true;
			break;
		}
	} // for

	if (!keyMatch) {
		return {
			body: {
				message: 'Bad Request'
			},
			contentType: 'text/json;charset=utf-8',
			status: 400 // Bad Request
		};
	}*/

	const repoId = `${COLLECTION_REPO_PREFIX}${collectionName}`;
	//log.info(`repoId:${toStr(repoId)}`);
	//log.info(`branchId:${toStr(branch)}`);
	const branchId = 'master'; // Deliberate hardcode
	runAsSu(() => maybeCreateRepoAndBranch({
		branchId,
		repoId
	}));

	const data = JSON.parse(body);
	//log.info(`data:${toStr(data)}`);

	const dataArray = forceArray(data);
	//log.info(`dataArray:${toStr(dataArray)}`);

	let user = getUser();
	if (!user) {
		// CreateNode tries to set owner, and fails when no user
		user = {
			displayName: EXPLORER_APP_USER.displayName,
			disabled: false,
			idProvider: EXPLORER_APP_USER.idProvider, // 'system',
			key: `user:${EXPLORER_APP_USER.idProvider}:${EXPLORER_APP_USER.name}`, // `user:system:${USER_EXPLORER_APP_NAME}`,
			login: EXPLORER_APP_USER.name, //USER_EXPLORER_APP_NAME,
			type: 'user'
		};
		//log.info(`user:${toStr(user)}`);
	}

	return run({
		//principals: [PRINCIPAL_EXPLORER_WRITE], // This allows any user to write
		user
	}, () => {
		const writeToCollectionBranchConnection = connect({
			branch: branchId,
			principals: [PRINCIPAL_EXPLORER_WRITE], // Additional principals to execute the callback with
			repoId//,
			//user // Default is the default user
		});
		const responseArray = [];
		for (let j = 0; j < dataArray.length; j++) {
			try {
				const toPersist = dataArray[j];

				// CREATE when idfield, _id, _name, _path not matched
				// Otherwise MODIFY

				if (toPersist._id) {
					if (writeToCollectionBranchConnection.exists(toPersist._id)) {
						modifyDocument({
							connection: writeToCollectionBranchConnection,
							id: toPersist._id,
							responseArray,
							toPersist
						});
					} else {
						createDocument({
							connection: writeToCollectionBranchConnection,
							responseArray,
							toPersist
						});
					}
				} else if (toPersist._name) {
					if (writeToCollectionBranchConnection.exists(`/${toPersist._name}`)) {
						modifyDocument({
							connection: writeToCollectionBranchConnection,
							id: `/${toPersist._name}`,
							responseArray,
							toPersist
						});
					} else {
						createDocument({
							connection: writeToCollectionBranchConnection,
							responseArray,
							toPersist
						});
					}
				} else if (toPersist._path) {
					if (writeToCollectionBranchConnection.exists(toPersist._path)) {
						modifyDocument({
							connection: writeToCollectionBranchConnection,
							id: toPersist._path,
							responseArray,
							toPersist
						});
					} else {
						createDocument({
							connection: writeToCollectionBranchConnection,
							responseArray,
							toPersist
						});
					}
				} else {
					createDocument({
						connection: writeToCollectionBranchConnection,
						responseArray,
						toPersist
					});
				}
			} catch (e) {
				log.error('Unknown error', e);
				responseArray.push({
					error: 'Unknown error'
				});
			}
		}
		return {
			body: responseArray,
			contentType: 'text/json;charset=utf-8'
		};
	}); // libContext.run
} // export function post
