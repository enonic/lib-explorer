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

	let keysArray = keysParam.split(',');

	if (idField) {
		// TODO use hasValue filter instead?
		const queryParams = {
			count: -1,
			query: `${idField} IN (${keysArray.map((k) => `'${k}'`).join(', ')})`
		};
		log.info(`queryParams:${toStr(queryParams)}`);
		const queryRes = readFromCollectionBranchConnection.query(queryParams);
		log.info(`queryRes:${toStr(queryRes)}`);
		keysArray = queryRes.hits.map(({id}) => id);
	}

	const writeToCollectionBranchConnection = connect({
		branch: branchId,
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId
	});
	const deleteRes = writeToCollectionBranchConnection.delete(...keysArray);
	return {
		body: deleteRes,
		contentType: 'text/json;charset=utf-8'
	};
} // function remove
