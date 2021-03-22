import {
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {get as getCollection} from '/lib/explorer/collection/get';
import {connect} from '/lib/explorer/repo/connect';
import {hash} from '/lib/explorer/string/hash';
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';

import {respondWithHtml} from '/lib/explorer/api/v1/documents/documentation';

function respondWithJson({
	apiKey,
	collectionName,
	count,
	keysParam,
	query,
	sort,
	start
}) {
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
	if (!keysParam && !query) {
		return {
			body: {
				message: 'You have to provide on of keys or query!'
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

	if (query) {
		const queryParams = {
			count,
			query,
			sort,
			start
		};
		//log.info(`queryParams:${toStr(queryParams)}`);

		const queryRes = readFromCollectionBranchConnection.query(queryParams);
		//log.info(`queryRes:${toStr(queryRes)}`);

		const keys = queryRes.hits.map(({id}) => id);
		//log.info(`keys:${toStr(keys)}`);

		const getRes = readFromCollectionBranchConnection.get(keys);
		//log.info(`getRes:${toStr(getRes)}`);

		const strippedRes = forceArray(getRes).map((node) => {
			// Not allowed to see any underscore fields (except _id, _name, _path)
			Object.keys(node).forEach((k) => {
				if (k === '_id' || k === '_name' || k === '_path') {
					// no-op
				} else if (k.startsWith('_')) {
					delete node[k];
				}
			});
			return node;
		});
		//log.info(`strippedRes:${toStr(strippedRes)}`);

		return {
			body: strippedRes,
			contentType: 'text/json;charset=utf-8'
		};
	} // query

	let keysArray = keysParam.split(',');

	const responseArray = [];
	keysArray.forEach((k) => {
		let keys = [k];

		const getRes = readFromCollectionBranchConnection.get(...keys);

		let item = {};
		if (!getRes) { // getRes === null
			item.error = `Unable to find document with key = ${k}`;
		} else if (Array.isArray(getRes)) { // getRes === [{},{}]
			item.error = `Found multiple documents with key = ${k}`;
		} else { // getRes === {}
			const strippedRes = forceArray(getRes).map((node) => {
				// Not allowed to see any underscore fields (except _id, _name, _path)
				Object.keys(node).forEach((k) => {
					if (k === '_id' || k === '_name' || k === '_path') {
						// no-op
					} else if (k.startsWith('_')) {
						delete node[k];
					}
				});
				return node;
			});
			//log.info(`strippedRes:${toStr(strippedRes)}`);
			item._id = strippedRes[0]._id;
			item.node = strippedRes[0];
		}
		responseArray.push(item);
	}); // forEach key

	return {
		body: responseArray,
		contentType: 'text/json;charset=utf-8'
	};
} // respondWithJson


export function get(request) {
	//log.info(`request:${toStr(request)}`);
	const {
		//body,
		headers: {
			Accept: acceptHeader
		},
		//method,
		params: {
			apiKey = '',
			//branch = branchDefault,
			collection: collectionParam = '',
			count: countParam = '-1',
			keys: keysParam = '',
			query = '',
			sort = 'score DESC',
			start: startParam = '0'
		} = {},
		pathParams: {
			collection: collectionName = collectionParam
		} = {}
	} = request;

	const count = parseInt(countParam, 10);
	const start = parseInt(startParam, 10);

	if (
		acceptHeader.startsWith('application/json') ||
		acceptHeader.startsWith('text/json')
	) {
		return respondWithJson({
			apiKey,
			count,
			collectionName,
			keysParam,
			query,
			sort,
			start
		});
	} else {
		return respondWithHtml({
			apiKey,
			count,
			collectionName,
			keysParam,
			query,
			sort,
			start
		});
	}
}
