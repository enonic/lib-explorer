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
import Router from '/lib/router';
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {
	getUser/*,
	hasRole*/
} from '/lib/xp/auth';

const router = Router();


router.all('/api', (/*request*/) => ({
	body: `<html>
	<head>
		<title>Versions - API documentation</title>
	</head>
	<body>
		<h1>API documentation</h1>
		<h2>Versions</h2>
		<ul>
			<li><a href="/api/1">1</a></li>
		</ul>
	</body>
	</html>`,
	contentType: 'text/html;charset=utf-8'
}));


router.all('/api/1', (/*request*/) => ({
	body: `<html>
	<head>
		<title>Endpoints - Version 1 - API documentation</title>
	</head>
	<body>
		<h1>API documentation</h1>
		<h2>Endpoints</h2>
		<ul>
			<li><a href="/api/1/documents">documents</a></li>
		</ul>
	</body>
	</html>`,
	contentType: 'text/html;charset=utf-8'
}));


router.all('/api/1/documents', (request) => {
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
		<title>Documents Endpoint - Version 1 - API documentation</title>
		<style>
			table {
				border: 1px solid black;
				border-collapse: collapse;
			}
			tr, th, td {
				border: 1px solid black;
			}
			th, td {
				padding: 1em;
			}
			.pre {
				white-space: pre;
			}
		</style>
	</head>
	<body>
		<h1>API documentation</h1>

		<h2>Method</h2>
		<p>POST</p>

		<h2>Headers</h2>
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th>Content-Type</th>
					<td>application/json</td>
				</tr>
			</tbody>
		</table>

		<h2>Parameters</h2>
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Attributes</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th>apiKey</th>
					<td>required</td>
					<td>The API key (password) for the collection you want to persist documents to.</td>
				</tr>
				<tr>
					<th>collectionName</th>
					<td>required</td>
					<td>The name of the collection you want to persist documents to.</td>
				</tr>
				<tr>
					<th>branch</th>
					<td>optional</td>
					<td>The name of the branch you want to persist documents to. Defaults to timestamp of now.</td>
				</tr>
				<tr>
					<th>uriField</th>
					<td>optional</td>
					<td>The name of which field in the provided data which is uniq. If not provided falls back through these: uri, _name, _path, urn, url.</td>
				</tr>
			</tbody>
		</table>

		<h2>body</h2>
		<p>Javascript object or array of objects, or json of the same</p>
		<table>
			<thead>
				<tr>
					<th>Type</th>
					<th>Data</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th>javascript object</th>
					<td class="pre">{
	text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	title: 'Hello World',
	uri: 'https://www.example.com'
}</td>
				</tr>
				<tr>
					<th>javascript array of objects</th>
					<td class="pre">[{
	text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	title: 'The standard Lorem Ipsum passage, used since the 1500s',
	uri: 'https://www.example.com'
},{
text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
title: 'Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC',
uri: 'https://www.iana.org/'
}]</td>
				</tr>
				<tr>
					<th>JSON of javascript object</th>
					<td class="pre">{
  "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "title":"Hello World",
  "uri":"https://www.example.com"
}</td>
				</tr>
				<tr>
					<th>JSON of javascript array of objects</th>
					<td class="pre">[
  {
    "text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "title":"The standard Lorem Ipsum passage, used since the 1500s",
    "uri":"https://www.example.com"
  },
  {
    "text":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    "title":"Section 1.10.32 of \\"de Finibus Bonorum et Malorum\\", written by Cicero in 45 BC",
    "uri":"https://www.iana.org/"
  }
]</td>
				</tr>
			</tbody>
		</table>

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
		<h2>Example form</h2>
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
	runAsSu(() => maybeCreateRepoAndBranch({
		branchId: branch,
		repoId
	}));

	const data = JSON.parse(body);
	//log.info(`data:${toStr(data)}`);

	const dataArray = forceArray(data);
	//log.info(`dataArray:${toStr(dataArray)}`);

	const writeToCollectionBranchConnection = connect({
		branch,
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

}); // documents


export const all = (r) => router.dispatch(r);
