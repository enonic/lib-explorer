export function respondWithHtml({
	apiKey,
	count,
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

				fetch(\`?apiKey=\${apiKey}\`, {
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

				var deleteKeys = document.getElementById('deleteKeys').value;
				//console.log('deleteKeys', deleteKeys);

				fetch(\`?apiKey=\${deleteApiKey}&keys=\${deleteKeys}\`, {
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
			<summary><span>GET</span> <b>/api/v1/documents</b> Get documents by keys or by query</summary>
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
						<th>keys</th>
						<td>provide this or query</td>
						<td>Comma seperated list of keys to get.</td>
					</tr>

					<tr>
						<th>count</th>
						<td>optional (defaults to 10, limited form 1 until 100)</td>
						<td>How many documents to get.</td>
					</tr>

					<tr>
						<th>start</th>
						<td>optional (defaults to 0)</td>
						<td>Start index (used for paging).</td>
					</tr>

					<tr>
						<th>query</th>
						<td>provide this or keys. When query provided keys will be ignored.</td>
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

					<dt><label for="getKeys">Keys</label></dt>
					<dd><input id="getKeys" name="getKeys" placeholder="provide this or query" size="80" type="text" value="${keysParam}"/></dd>

					<dt><label for="getStart">Start</label></dt>
					<dd><input id="getStart" name="getStart" type="number" value="${start}"/></dd>

					<dt><label for="getCount">Count</label></dt>
					<dd><input id="getCount" name="getCount" type="number" value="${count}"/></dd>

					<dt><label for="getQuery">Query</label></dt>
					<dd><input id="getQuery" name="getQuery" placeholder="if provided keys ignored" size="80" type="text" value="${query}"/></dd>

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
			<samp>[{
	_id: 'created_id'
},{
	_id: 'modified_id',
},{
	error: 'Something went wrong when trying to create the document!'
},{
	error: 'Something went wrong when trying to modify the document!'
}]</samp>

			<h2>POST Form Create or modify (XHR)</h2>
			<form autocomplete="off" method="POST" novalidate onsubmit="return myPost(event)">
				<dl>
					<dt><label for="apiKey">API Key</label></dt>
					<dd><input id="apiKey" name="apiKey" placeholder="required" required size="80" type="text" value="${apiKey}"/></dd>

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
