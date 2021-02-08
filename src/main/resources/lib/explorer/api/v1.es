import {
	ROLE_EXPLORER_ADMIN,
	ROLE_EXPLORER_WRITE,
	ROLE_SYSTEM_ADMIN
} from '/lib/explorer/model/2/constants';
import Router from '/lib/router';
import {
	//getUser,
	hasRole} from '/lib/xp/auth';
import {toStr} from '/lib/util';

const router = Router();


router.all('/1/documents', (request) => {
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
	log.info(`body:${toStr(body)}`);
	//log.info(`method:${toStr(method)}`);
	log.info(`params:${toStr(params)}`);

	//const now = Date.now(); // number of milliseconds elapsed since January 1, 1970 00:00:00 UTC
	const d = new Date();
	const branchDefault = `${d.getFullYear()}_${d.getMonth()+1}_${d.getDate()}T${d.getHours()}_${d.getMinutes()}_${d.getSeconds()}`;

	const {
		branch = branchDefault,
		collection = '',
		uriField = ''
	} = params;
	log.info(`branch:${toStr(branch)}`);
	log.info(`collection:${toStr(collection)}`);
	log.info(`uriField:${toStr(uriField)}`);

	if (method === 'GET') {
		return {
			body: `<html>
	<head>
		<title>API documentation</title>
	</head>
	<body>
		<h1>API documentation</h1>
		<script>
			function mySubmit(event) {
				console.log('event', event);
				event.preventDefault();

				var collection = document.getElementById('collection').value;
				console.log('collection', collection);

				var branch = document.getElementById('branch').value;
				console.log('branch', branch);

				var uriField = document.getElementById('uriField').value;
				console.log('uriField', uriField);

				var js = document.getElementById('js').value;
				console.log('js', js);

				var json = JSON.stringify(js);
				console.log('json', json);

				fetch(\`?collection=\${collection}&branch=\${branch}&uriField=\${uriField}\`, {
					method: 'POST',
					body: json
				}).then(data => {
    console.log(data);
  });

				return false;
			}
		</script>
		<form autocomplete="off" method="POST" novalidate onsubmit="return mySubmit(event)">
			<dl>
				<dt><label for="collection">Collection</label></dt>
				<dd><input id="collection" name="collection" placeholder="required" required size="80" type="text" value="${collection}"/></dd>
				<dt><label for="branch">Branch</label></dt>
				<dd><input id="branch" name="branch" placeholder="optionial generated" size="80" type="text" value="${branch}"/></dd>
				<dt><label for="uriField">Uri field</label></dt>
				<dd><input id="uriField" name="uriField" placeholder="optionial detected" size="80" type="text" value="${uriField}"/></dd>
				<dt><label for="js">Javascript object or array of objects, or json of the same</label></dt>
				<dd><textarea cols="80" id="js" name="js" rows="9">{
	language: 'english',
	text: 'This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.',
	title: 'Example Domain',
	url: 'https://www.example.com'
}</textarea></dd>
			<input type="submit">
		</form>

	</body>
</html>`,
			contentType: 'text/html;charset=utf-8'
		};
	} // method === 'GET'

	if (method === 'POST') {
		if (!collection) {
			return {
				body: {
					message: 'Missing required url query parameter collection!'
				},
				contentType: 'text/json;charset=utf-8',
				status: 400 // Bad Request
			};
		}
		const data = JSON.parse(body);
		log.info(`data:${toStr(data)}`);
		// TODO
	} // method === 'POST'

	return {
		status: 405 // Method not allowed
	};
}); // documents


export const all = (r) => router.dispatch(r);
