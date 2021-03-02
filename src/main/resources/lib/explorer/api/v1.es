/*
mapping.api.host = localhost
mapping.api.source = /api
mapping.api.target = /webapp/com.enonic.app.explorer/api
mapping.api.idProvider.system = default
*/

import {
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_EXPLORER_READ,
	PRINCIPAL_EXPLORER_WRITE,
	ROLE_EXPLORER_ADMIN,
	ROLE_EXPLORER_WRITE,
	ROLE_SYSTEM_ADMIN
} from '/lib/explorer/model/2/constants';
import {Document} from '/lib/explorer/model/2/nodeTypes/document';
import {get as getCollection} from '/lib/explorer/collection/get';
import {createOrModify} from '/lib/explorer/node/createOrModify';
import {connect} from '/lib/explorer/repo/connect';
import {maybeCreate as maybeCreateRepoAndBranch} from '/lib/explorer/repo/maybeCreate';
import {hash} from '/lib/explorer/string/hash';
import Router from '/lib/router';
import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {
	//getUser,
	hasRole} from '/lib/xp/auth';

const router = Router();


router.all('/api/1/documents', (request) => {
	//log.info(`request:${toStr(request)}`);

	//const user = getUser();
	//log.info(`user:${toStr(user)}`);

	if (!(
		hasRole(ROLE_SYSTEM_ADMIN)
		|| hasRole(ROLE_EXPLORER_ADMIN)
		|| hasRole(ROLE_EXPLORER_WRITE)
	)) {
		return {
			status: 403
		};
	}

	const {
		body,
		method,
		params
	} = request;
	//log.info(`body:${toStr(body)}`);
	//log.info(`method:${toStr(method)}`);
	//log.info(`params:${toStr(params)}`);

	//const now = Date.now(); // number of milliseconds elapsed since January 1, 1970 00:00:00 UTC
	const d = new Date();
	const branchDefault = `${d.getFullYear()}_${d.getMonth()+1}_${d.getDate()}T${d.getHours()}_${d.getMinutes()}_${d.getSeconds()}`;

	const {
		apiKey = '',
		branch = branchDefault,
		collectionName = '',
		uriField = '' // '' is Falsy
	} = params;
	//log.info(`apiKey:${toStr(apiKey)}`);
	//log.info(`branch:${toStr(branch)}`);
	//log.info(`collectionName:${toStr(collectionName)}`);
	//log.info(`uriField:${toStr(uriField)}`);

	if (method === 'GET') {
		return {
			body: `<html>
	<head>
		<title>API documentation</title>
	</head>
	<body>
		<h1>API documentation</h1>
		<script>
			function IsJsonString(str) {
    			try {
        			JSON.parse(str);
    			} catch (e) {
        			return false;
    			}
				return true;
			}
			function mySubmit(event) {
				console.log('event', event);
				event.preventDefault();

				var apiKey = document.getElementById('apiKey').value;
				console.log('apiKey', apiKey);

				var collectionName = document.getElementById('collectionName').value;
				console.log('collectionName', collectionName);

				var branch = document.getElementById('branch').value;
				console.log('branch', branch);

				var uriField = document.getElementById('uriField').value;
				console.log('uriField', uriField);

				var jsStr = document.getElementById('js').value;
				console.log('jsStr', jsStr);

				var json = "{}";
				if (IsJsonString(jsStr)) {
					json = jsStr;
				} else {
					eval('var js = ' + jsStr);
					console.log('js', js);
					json = JSON.stringify(js);
					console.log('json', json);
				}

				fetch(\`?apiKey=\${apiKey}&collectionName=\${collectionName}&branch=\${branch}&uriField=\${uriField}\`, {
					headers: {
						'Content-Type': 'application/json'
					},
					body: json,
					method: 'POST'
				}).then(data => {
    console.log(data);
  });

				return false;
			}
		</script>
		<form autocomplete="off" method="POST" novalidate onsubmit="return mySubmit(event)">
			<dl>
				<dt><label for="apiKey">API Key</label></dt>
				<dd><input id="apiKey" name="apiKey" placeholder="required" required size="80" type="text" value="${apiKey}"/></dd>
				<dt><label for="collectionName">Collection name</label></dt>
				<dd><input id="collectionName" name="collectionName" placeholder="required" required size="80" type="text" value="${collectionName}"/></dd>
				<dt><label for="branch">Branch</label></dt>
				<dd><input id="branch" name="branch" placeholder="optionial generated" size="80" type="text" value="${branch}"/></dd>
				<dt><label for="uriField">Uri field</label></dt>
				<dd><input id="uriField" name="uriField" placeholder="optionial detected" size="80" type="text" value="${uriField}"/></dd>
				<dt><label for="js">Javascript object or array of objects, or json of the same</label></dt>
				<dd><textarea cols="173" id="js" name="js" rows="14">[{
	language: 'english',
	text: 'This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.',
	title: 'Example Domain',
	url: 'https://www.example.com'
},{
	language: 'english',
	text: 'Whatever',
	title: 'Whatever',
	url: 'https://www.whatever.com'
}]</textarea></dd>
			<input type="submit">
		</form>

	</body>
</html>`,
			contentType: 'text/html;charset=utf-8'
		};
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
	log.info(`collection:${toStr(collection)}`);

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
	log.info(`hashedApiKey:${toStr(hashedApiKey)}`);

	const arrApiKeys = forceArray(apiKeys);
	let keyMatch = false;
	for (let i = 0; i < arrApiKeys.length; i++) {
		const {key} = arrApiKeys[i];
		log.info(`key:${toStr(key)}`);
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
	log.info(`repoId:${toStr(repoId)}`);
	log.info(`branchId:${toStr(branch)}`);
	maybeCreateRepoAndBranch({
		branchId: branch,
		repoId
	});

	const data = JSON.parse(body);
	log.info(`data:${toStr(data)}`);

	const dataArray = forceArray(data);
	log.info(`dataArray:${toStr(dataArray)}`);

	const writeToCollectionBranchConnection = connect({
		branch,
		principals: [PRINCIPAL_EXPLORER_WRITE],
		repoId
	});

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
		log.info(`toPersist:${toStr(toPersist)}`);
		toPersist.__connection = writeToCollectionBranchConnection;
		const persistedNode = createOrModify(Document(toPersist));
		log.info(`persistedNode:${toStr(persistedNode)}`);
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

}); // documents


export const all = (r) => router.dispatch(r);
