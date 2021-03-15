export function get(request) {
	const {
		//body,
		//method,
		params: {
			apiKey = '',
			//branch = branchDefault,
			collection: collectionName = '',
			idField = '' // '' is Falsy
		} = {}
	} = request;
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
		}
		.method-get, .method-post {
			border-radius: 3px;
			color: white;
			font-size: 14px;
    		font-weight: 700;
			min-width: 80px;
			padding: 6px 15px;
			text-align: center;
		}
		.method-get {
			background-color: blue;
		}
		.method-post {
			background-color: green;
		}
	</style>
	</head>
	<body>
	<h1>API documentation</h1>

	<details>
		<summary><span class="method-get">GET</span> <b>/api/v1/documents</b> Show documentation</summary>
		Todo
	</details>

	<details>
		<summary><span class="method-post">POST</span> <b>/api/v1/documents</b> Create or modify documents</summary>
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
	</details>


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

			var collection = document.getElementById('collection').value;
			console.log('collection', collection);

			//var branch = document.getElementById('branch').value;
			//console.log('branch', branch);

			var idField = document.getElementById('idField').value;
			console.log('idField', idField);

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

			// &branch=\${branch}

			fetch(\`?apiKey=\${apiKey}&collection=\${collection}&idField=\${idField}\`, {
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
			<dt><label for="collection">Collection name</label></dt>
			<dd><input id="collection" name="collection" placeholder="required" required size="80" type="text" value="${collectionName}"/></dd>
			<!--dt><label for="branch">Branch</label></dt>
			<dd><input id="branch" name="branch" placeholder="optionial generated" size="80" type="text" value=""/></dd-->
			<dt><label for="idField">Id field</label></dt>
			<dd><input id="idField" name="idField" placeholder="optionial detected" size="80" type="text" value="${idField}"/></dd>
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
}
