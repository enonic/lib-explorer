/*
mapping.api.host = localhost
mapping.api.source = /api
mapping.api.target = /webapp/com.enonic.app.explorer/api
mapping.api.idProvider.system = default
*/

import {
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_EXPLORER_READ,
	PRINCIPAL_EXPLORER_WRITE/*,
	ROLE_EXPLORER_ADMIN,
	ROLE_EXPLORER_WRITE,
	ROLE_SYSTEM_ADMIN*/
} from '/lib/explorer/model/2/constants';
import {USER as EXPLORER_APP_USER} from '/lib/explorer/model/2/users/explorer';
import {Document} from '/lib/explorer/model/2/nodeTypes/document';
import {get as getCollection} from '/lib/explorer/collection/get';
import {createOrModify} from '/lib/explorer/node/createOrModify';
import {connect} from '/lib/explorer/repo/connect';
import {maybeCreate as maybeCreateRepoAndBranch} from '/lib/explorer/repo/maybeCreate';
import {runAsSu} from '/lib/explorer/runAsSu';
import {hash} from '/lib/explorer/string/hash';
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {
	getUser/*,
	hasRole*/
} from '/lib/xp/auth';

import {get} from '/lib/explorer/api/v1/documents/get';

export function all(request) {
	//log.info(`request:${toStr(request)}`);

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
		method,
		params
	} = request;
	//log.info(`body:${toStr(body)}`);
	//log.info(`method:${toStr(method)}`);
	//log.info(`params:${toStr(params)}`);

	//const d = new Date();
	//const branchDefault = `${d.getFullYear()}_${d.getMonth()+1}_${d.getDate()}T${d.getHours()}_${d.getMinutes()}_${d.getSeconds()}`;

	const {
		apiKey = '',
		//branch = branchDefault,
		collection: collectionName = '',
		uriField = '' // '' is Falsy
	} = params;
	//log.info(`apiKey:${toStr(apiKey)}`);
	//log.info(`branch:${toStr(branch)}`);
	//log.info(`collectionName:${toStr(collectionName)}`);
	//log.info(`uriField:${toStr(uriField)}`);

	if (method === 'GET') {
		return get(request);
	} // method === 'GET'

	if (method !== 'POST') {
		return {
			status: 405 // Method not allowed
		};
	}

	if (!collectionName) {
		return {
			body: {
				message: 'Missing required url query parameter collection!'
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

	const collection = getCollection({
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
	}
	const {
		collector: {
			config: {
				apiKeys = []
			} = {}
		} = {}
	} = collection;

	const hashedApiKey = hash(apiKey);
	//log.info(`hashedApiKey:${toStr(hashedApiKey)}`);

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
	}

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

	const writeToCollectionBranchConnection = connect({
		branch: branchId,
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId
	});

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

	for (let j = 0; j < dataArray.length; j++) {
		const toPersist = dataArray[j];
		if (!toPersist.uri) { // TODO Find a uriField on first item, and reuse?
			if (uriField) {
				if (toPersist[uriField]) {
					toPersist.uri = toPersist[uriField];
					delete toPersist[uriField];
				} else {
					throw new Error(`uriField ${uriField} cannot be empty!`);
				}
			} else { // Try fallback loop
				const fallbacks = [
					'_name',
					'_path',
					'urn',
					'url'
				];
				for (let k = 0; k < fallbacks.length; k++) {
					const fallback = fallbacks[k];
					if (toPersist[fallback]) {
						toPersist.uri = toPersist[fallback];
						delete toPersist[fallback];
					}
				}
				if (!toPersist.uri) {
					throw new Error('Unable to find value for uri field!');
				}
			}
		}
		// CreateNode tries to set owner, and fails when no user
		toPersist.__user = user; // eslint-disable-line no-underscore-dangle

		//log.info(`toPersist:${toStr(toPersist)}`);
		toPersist.__connection = writeToCollectionBranchConnection;

		const persistedNode = createOrModify(Document(toPersist));
		//log.info(`persistedNode:${toStr(persistedNode)}`);
		if (!persistedNode) {
			throw new Error('Something went wrong when trying to persist a document!');
		}
		/*try {

		} catch (e) {

		}*/
	}

	return {
		body: {},
		contentType: 'text/json;charset=utf-8'
	};
}
