export function get() {
	return {
		body: `<html>
		<head>
			<title>Endpoints - Version 1 - API documentation</title>
		</head>
		<body>
			<h1>API documentation</h1>
			<h2>Endpoints</h2>
			<ul>
				<li><a href="/api/v1/documents">documents</a></li>
			</ul>
		</body>
		</html>`,
		contentType: 'text/html;charset=utf-8'
	};
}
