import {
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {get as getCollection} from '/lib/explorer/collection/get';
import {connect} from '/lib/explorer/repo/connect';
import {hash} from '/lib/explorer/string/hash';
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';


function respondWithHtml({
	apiKey,
	collectionName,
	count,
	idField,
	keysParam,
	query,
	sort,
	start
}) {
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
			details {
				border: 1px solid black;
				border-radius: 4px;
				margin: 6px;
				padding: 6px;
			}
			.method-get span,
			.method-post span,
			.method-delete span {
				border-radius: 3px;
				color: white;
				display: inline-block;
				font-size: 14px;
	    		font-weight: 700;
				min-width: 80px;
				padding: 6px 15px;
				text-align: center;
			}
			.method-get {
				background-color: lightblue;
				border-color: blue;
			}
			.method-get span {
				background-color: blue;
			}
			.method-post {
				background-color: lightgreen;
				border-color: green;
			}
			.method-post span {
				background-color: green;
			}
			.method-delete {
				background-color: #ffcccb;
				border-color: red;
			}
			.method-delete span {
				background-color: red;
			}
			samp {
				background-color: black;
				color: white;
				display: block;
				margin: 6px;
				padding: 6px;
				white-space: pre;
			}
		</style>
		<script>
			function IsJsonString(str) {
				try {
					JSON.parse(str);
				} catch (e) {
					return false;
				}
				return true;
			}

			function myGet(event) {
				//console.log('event', event);
				event.preventDefault();

				const params = {};

				var getApiKey = document.getElementById('getApiKey').value;
				if (getApiKey) {
					params.apiKey = getApiKey;
				}

				var getCollection = document.getElementById('getCollection').value;
				if (getCollection) {
					params.collection = getCollection;
				}

				//var getBranch = document.getElementById('getBranch').value;
				//console.log('getBranch', getBranch);

				var getIdField = document.getElementById('getIdField').value;
				if (getIdField) {
					params.idField = getIdField;
				}

				var getCount = document.getElementById('getCount').value;
				if (getCount) {
					params.count = getCount;
				}

				var getStart = document.getElementById('getStart').value;
				if (getStart) {
					params.start = getStart;
				}

				var getQuery = document.getElementById('getQuery').value;
				if (getQuery) {
					params.query = getQuery;
				}

				var getSort = document.getElementById('getSort').value;
				if (getSort) {
					params.sort = getSort;
				}

				var getKeys = document.getElementById('getKeys').value;
				if (getKeys) {
					params.keys = getKeys;
				}

				//console.log('params', params);

				const urlQuery = Object.keys(params).map((k) => \`\${k}=\${params[k]}\`).join('&');
				//console.log('urlQuery', urlQuery);

				fetch(\`?\${urlQuery}\`, {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'GET'
				});/*.then(data => {
					console.log(data);
				});*/

				return false;
			}

			function myPost(event) {
				//console.log('event', event);
				event.preventDefault();

				var apiKey = document.getElementById('apiKey').value;
				//console.log('apiKey', apiKey);

				var collection = document.getElementById('collection').value;
				//console.log('collection', collection);

				//var branch = document.getElementById('branch').value;
				//console.log('branch', branch);

				var idField = document.getElementById('idField').value;
				//console.log('idField', idField);

				var jsStr = document.getElementById('js').value;
				//console.log('jsStr', jsStr);

				var json = "{}";
				if (IsJsonString(jsStr)) {
					json = jsStr;
				} else {
					eval('var js = ' + jsStr);
					//console.log('js', js);
					json = JSON.stringify(js);
					//console.log('json', json);
				}

				// &branch=\${branch}

				fetch(\`?apiKey=\${apiKey}&collection=\${collection}&idField=\${idField}\`, {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: json,
					method: 'POST'
				});/*.then(data => {
					console.log(data);
				});*/

				return false;
			}

			function myDelete(event) {
				//console.log('event', event);
				event.preventDefault();

				var deleteApiKey = document.getElementById('deleteApiKey').value;
				//console.log('deleteApiKey', deleteApiKey);

				var deleteCollection = document.getElementById('deleteCollection').value;
				console.log('deleteCollection', deleteCollection);

				//var deleteBranch = document.getElementById('deleteBranch').value;
				//console.log('deleteBranch', deleteBranch);

				var deleteIdField = document.getElementById('deleteIdField').value;
				//console.log('deleteIdField', deleteIdField);

				var deleteKeys = document.getElementById('deleteKeys').value;
				//console.log('deleteKeys', deleteKeys);

				// &branch=\${deleteBranch}
				fetch(\`?apiKey=\${deleteApiKey}&collection=\${deleteCollection}&idField=\${deleteIdField}&keys=\${deleteKeys}\`, {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'DELETE'
				});/*.then(data => {
					console.log(data);
				});*/

				return false;
			}
		</script>
	</head>
	<body>
		<h1>API documentation</h1>

		<details class="method-get">
			<summary><span>GET</span> <b>/api/v1/documents</b> Get documents by keys (in idField) or by query</summary>
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
						<th>Accept</th>
						<td>application/json</td>
					</tr>
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
						<td>The API key (password) for the collection you want to get documents from.</td>
					</tr>
					<tr>
						<th>collection</th>
						<td>required</td>
						<td>The name of the collection you want to get documents from.</td>
					</tr>
					<!--tr>
						<th>branch</th>
						<td>optional</td>
						<td>The name of the branch you want to get documents from. Defaults to timestamp of now.</td>
					</tr-->

					<tr>
						<th>keys</th>
						<td>provide this or query</td>
						<td>Comma seperated list of keys to get. Use idField to select which field to look for key in.</td>
					</tr>
					<tr>
						<th>idField</th>
						<td>optional (will be ignored if query is provided)</td>
						<td>The name of which field in the provided data which contains the uniq document id. If not provided falls back to _id.</td>
					</tr>

					<tr>
						<th>count</th>
						<td>optional (defaults to -1 which means all)</td>
						<td>How many documents to get.</td>
					</tr>

					<tr>
						<th>start</th>
						<td>optional (defaults to 0)</td>
						<td>Start index (used for paging).</td>
					</tr>

					<tr>
						<th>query</th>
						<td>provide this or keys. When query provided keys and idField will be ignored.</td>
						<td>Query expression.</td>
					</tr>

					<tr>
						<th>sort</th>
						<td>optional (defaults to score DESC)</td>
						<td>Sorting expression.</td>
					</tr>

				</tbody>
			</table>

			<h2>Example response</h2>
			<samp>[{
	_id: 'existing_id'
	node: {
		_id: 'existing_id'
		field: 'value'
	}
},{
	_id: 'non_existant_id',
	error: 'Unable to find document with key = non_existant_id!'
}]</samp>

			<h2>GET Form (XHR)</h2>
			<form autocomplete="off" method="GET" novalidate onsubmit="return myGet(event)">
				<dl>
					<dt><label for="getApiKey">API Key</label></dt>
					<dd><input id="getApiKey" name="getApiKey" placeholder="required" required size="80" type="text" value="${apiKey}"/></dd>

					<dt><label for="getCollection">Collection name</label></dt>
					<dd><input id="getCollection" name="getCollection" placeholder="required" required size="80" type="text" value="${collectionName}"/></dd>

					<!--dt><label for="getBranch">Branch</label></dt>
					<dd><input id="getBranch" name="getBranch" placeholder="optionial generated" size="80" type="text" value=""/></dd-->

					<dt><label for="getIdField">Id field</label></dt>
					<dd><input id="getIdField" name="getIdField" placeholder="optionial" size="80" type="text" value="${idField}"/></dd>

					<dt><label for="getKeys">Keys</label></dt>
					<dd><input id="getKeys" name="getKeys" placeholder="provide this or query" size="80" type="text" value="${keysParam}"/></dd>

					<dt><label for="getStart">Start</label></dt>
					<dd><input id="getStart" name="getStart" type="number" value="${start}"/></dd>

					<dt><label for="getCount">Count</label></dt>
					<dd><input id="getCount" name="getCount" type="number" value="${count}"/></dd>

					<dt><label for="getQuery">Query</label></dt>
					<dd><input id="getQuery" name="getQuery" placeholder="if provided keys and idField ignored" size="80" type="text" value="${query}"/></dd>

					<dt><label for="getSort">Sort</label></dt>
					<dd><input id="getSort" name="getSort" placeholder="optionial" size="80" type="text" value="${sort}"/></dd>
				</dl>
				<input type="submit" value="GET">
			</form>
		</details>

		<details class="method-post">
			<summary><span>POST</span> <b>/api/v1/documents</b> Create or modify documents</summary>
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
						<th>Accept</th>
						<td>application/json</td>
					</tr>
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
						<th>collection</th>
						<td>required</td>
						<td>The name of the collection you want to persist documents to.</td>
					</tr>
					<!--tr>
						<th>branch</th>
						<td>optional</td>
						<td>The name of the branch you want to persist documents to. Defaults to timestamp of now.</td>
					</tr-->
					<tr>
						<th>idField</th>
						<td>optional</td>
						<td>The name of which field in the provided data which contains the uniq document id. If not provided a new document is created with a generated id.</td>
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

			<h2>Example responses</h2>

			<h3>When idField unset</h3>
			<samp>[{
	_id: 'created_id'
},{
	_id: 'modified_id',
},{
	error: 'Something went wrong when trying to create the document!'
},{
	error: 'Something went wrong when trying to modify the document!'
}]</samp>

	<h3>When idField set to url</h3>
	<samp>[{
	url: 'https://www.example.com'
},{
	url: 'https://www.iana.org',
},{
	error: 'idField url cannot be empty!'
},{
	error: Unable to modify. Multiple documents found where url is value!
}]</samp>

			<h2>POST Form Create or modify (XHR)</h2>
			<form autocomplete="off" method="POST" novalidate onsubmit="return myPost(event)">
				<dl>
					<dt><label for="apiKey">API Key</label></dt>
					<dd><input id="apiKey" name="apiKey" placeholder="required" required size="80" type="text" value="${apiKey}"/></dd>

					<dt><label for="collection">Collection name</label></dt>
					<dd><input id="collection" name="collection" placeholder="required" required size="80" type="text" value="${collectionName}"/></dd>

					<!--dt><label for="branch">Branch</label></dt>
					<dd><input id="branch" name="branch" placeholder="optionial generated" size="80" type="text" value=""/></dd-->

					<dt><label for="idField">Id field</label></dt>
					<dd><input id="idField" name="idField" placeholder="optionial" size="80" type="text" value="${idField}"/></dd>

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
				<input type="submit" value="POST">
			</form>
		</details>

		<details class="method-delete">
			<summary><span>DELETE</span> <b>/api/v1/documents</b> Delete documents</summary>
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
						<th>Accept</th>
						<td>application/json</td>
					</tr>
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
						<td>The API key (password) for the collection you want to delete documents from.</td>
					</tr>
					<tr>
						<th>collection</th>
						<td>required</td>
						<td>The name of the collection you want to delete documents from.</td>
					</tr>
					<!--tr>
						<th>branch</th>
						<td>optional</td>
						<td>The name of the branch you want to delete documents from. Defaults to timestamp of now.</td>
					</tr-->
					<tr>
						<th>idField</th>
						<td>optional</td>
						<td>The name of which field in the provided data which contains the uniq document id. If not provided falls back to _id.</td>
					</tr>
				</tbody>
			</table>

			<h2>Example response</h2>
			<samp>[{
	_id: 'existing_id'
},{
	_id: 'non_existant_id',
	error: 'Unable to find document with key = non_existant_id!'
}]</samp>
			<h2>DELETE Form (XHR)</h2>
			<form autocomplete="off" method="DELETE" novalidate onsubmit="return myDelete(event)">
				<dl>
					<dt><label for="deleteApiKey">API Key</label></dt>
					<dd><input id="deleteApiKey" name="deleteApiKey" placeholder="required" required size="80" type="text" value="${apiKey}"/></dd>

					<dt><label for="deleteCollection">Collection name</label></dt>
					<dd><input id="deleteCollection" name="deleteCollection" placeholder="required" required size="80" type="text" value="${collectionName}"/></dd>

					<!--dt><label for="deleteBranch">Branch</label></dt>
					<dd><input id="deleteBranch" name="deleteBranch" placeholder="optionial generated" size="80" type="text" value=""/></dd-->

					<dt><label for="deleteIdField">Id field</label></dt>
					<dd><input id="deleteIdField" name="deleteIdField" placeholder="optionial" size="80" type="text" value="${idField}"/></dd>

					<dt><label for="deleteKeys">Keys</label></dt>
					<dd><input id="deleteKeys" name="deleteKeys" placeholder="required" size="80" type="text" value="${keysParam}"/></dd>
				</dl>
				<input type="submit" value="DELETE">
			</form>
		</details>
	</body>
</html>`,
		contentType: 'text/html;charset=utf-8'
	};
} // respondWithHtml


function respondWithJson({
	apiKey,
	collectionName,
	count,
	idField,
	keysParam,
	query,
	sort,
	start
}) {
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

		if (idField) {
			const queryParams = {
				count,
				query: `${idField} = '${k}'`
			};
			//log.info(`queryParams:${toStr(queryParams)}`);
			const queryRes = readFromCollectionBranchConnection.query(queryParams);
			//log.info(`queryRes:${toStr(queryRes)}`);
			keys = queryRes.hits.map(({id}) => id);
		}

		const getRes = readFromCollectionBranchConnection.get(...keys);

		let item = {};
		if (!getRes) { // getRes === null
			if (idField) {
				item.error = `Unable to find document with ${idField} = ${k}`;
			} else {
				item.error = `Unable to find document with key = ${k}`;
			}
		} else if (Array.isArray(getRes)) { // getRes === [{},{}]
			if (idField) {
				item.error = `Found multiple documents with ${idField} = ${k}`;
			} else {
				item.error = `Found multiple documents with key = ${k}`;
			}
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
			if (idField) {
				item[idField] = strippedRes[0].[idField];
			} else {
				item._id = strippedRes[0]._id;
			}
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
			collection: collectionName = '',
			count: countParam = '-1',
			idField = '', // '' is Falsy
			keys: keysParam = '',
			query = '',
			sort = 'score DESC',
			start: startParam = '0'
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
			idField,
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
			idField,
			keysParam,
			query,
			sort,
			start
		});
	}
}
