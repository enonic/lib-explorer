import {
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_EXPLORER_READ,
	PRINCIPAL_EXPLORER_WRITE
} from '/lib/explorer/model/2/constants';
import {get as getCollection} from '/lib/explorer/collection/get';
import {connect} from '/lib/explorer/repo/connect';
import {hash} from '/lib/explorer/string/hash';
import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';

export function remove(request) {
	const {
		params: {
			apiKey = '',
			//branch = branchDefault,
			collection: collectionName = '',
			idField = '', // '' is Falsy
			keys: keysParam = ''
		} = {}
	} = request;
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
	if (!keysParam) {
		return {
			body: {
				message: 'Missing required url query parameter keys!'
			},
			contentType: 'text/json;charset=utf-8',
			status: 400 // Bad Request
		};
	}

	const readConnection = connect({
		principals: [PRINCIPAL_EXPLORER_READ]
	});

	const collection = getCollection({
		connection: readConnection,
		name: collectionName
	});

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

	const branchId = 'master'; // Deliberate hardcode
	const readFromCollectionBranchConnection = connect({
		branch: branchId,
		principals: [PRINCIPAL_EXPLORER_READ],
		repoId
	});
	const writeToCollectionBranchConnection = connect({
		branch: branchId,
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId
	});

	let keysArray = keysParam.split(',');

	const responseArray = [];
	keysArray.forEach((k) => {
		let keys = [k];

		if (idField) {
			const queryParams = {
				count: -1,
				query: `${idField} = '${k}'`
			};
			//log.info(`queryParams:${toStr(queryParams)}`);
			const queryRes = readFromCollectionBranchConnection.query(queryParams);
			//log.info(`queryRes:${toStr(queryRes)}`);
			keys = queryRes.hits.map(({id}) => id);
		}
		//log.info(`keys:${toStr(keys)}`);
		const getRes = readFromCollectionBranchConnection.get(...keys);
		//log.info(`getRes:${toStr(getRes)}`);

		let item = {};
		if (!getRes) { // getRes === null
			if (idField) {
				item.error = `Unable to find document with ${idField} = ${k}!`;
			} else {
				item.error = `Unable to find document with key = ${k}!`;
			}
		} else if (Array.isArray(getRes)) { // getRes === [{},{}]
			if (idField) {
				item.error = `Found multiple documents with ${idField} = ${k}!`;
			} else {
				item.error = `Found multiple documents with key = ${k}!`;
			}
		} else { // getRes === {}
			const deleteRes = writeToCollectionBranchConnection.delete(keys[0]);
			if (deleteRes.length === 1) {
				if (idField) {
					item[idField] = k;
				} else {
					item._id = getRes._id;
				}
			} else {
				if (idField) {
					item.error = `Unable to delete documents with ${idField} = ${k}!`;
				} else {
					item.error = `Unable to delete documents with key = ${k}!`;
				}
			}
		}
		responseArray.push(item);
	}); // forEach key

	return {
		body: responseArray,
		contentType: 'text/json;charset=utf-8'
	};
} // function remove
