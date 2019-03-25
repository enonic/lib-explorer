import {TOOL_PATH} from '/lib/enonic/yase/constants';
//import {toStr} from '/lib/enonic/util';
import {assetUrl} from '/lib/xp/portal';


export function htmlResponse({
	bodyEnd = [],
	headBegin = [],
	main = '',
	messages = [],
	toolPath = TOOL_PATH,
	path = toolPath,
	title = '',
	status = 200
} = {}) {
	const relPath = path.replace(toolPath, ''); //log.info(toStr({relPath}));
	const preTitle = title ? `${title} - ` : '';
	return {
		body: `<html>
	<head>
		${headBegin.join('\n')}
		<title>${preTitle}YASE</title>
		<link rel="shortcut icon" href="${assetUrl({path: 'favicon.ico'})}">
		<link rel="stylesheet" type="text/css" href="${assetUrl({path: 'style.css'})}">
		<link rel="stylesheet" type="text/css" href="${assetUrl({path: 'semantic-ui/semantic.css'})}">
	</head>
	<body>
		<nav>
			<ul>
				<li><a class="${relPath === '' ? 'current' : ''}" href="${toolPath}">YASE</a></li>
				<li><a class="${relPath.startsWith('/collections') ? 'current' : ''}" href="${toolPath}/collections">Collections</a></li>
				<li><a class="${relPath.startsWith('/fields') ? 'current' : ''}" href="${toolPath}/fields">Fields</a></li>
				<li><a class="${relPath.startsWith('/tags') ? 'current' : ''}" href="${toolPath}/tags">Tags</a></li>
				<li><a class="${relPath.startsWith('/thesauri') ? 'current' : ''}" href="${toolPath}/thesauri">Thesauri</a></li>
				<li><a class="${relPath.startsWith('/interfaces') ? 'current' : ''}" href="${toolPath}/interfaces">Interfaces</a></li>
			</ul>
		</nav>
		${messages.length ? `<ul class="${status === 200 ? 'success' : 'error'}">${messages.map(m => `<li>${m}</li>`)}</ul>` : ''}
		<main>${main}</main>
		${bodyEnd.join('\n')}
		<script type="text/javascript" src="${assetUrl({path: 'jquery/jquery.js'})}"></script>
		<script type="text/javascript">
			jQuery = $;
		</script>
		<script type="text/javascript" src="${assetUrl({path: 'semantic-ui/semantic.js'})}"></script>
		<script type="text/javascript" src="${assetUrl({path: 'js/tablesort.js'})}"></script>
		<script type="text/javascript">
			$(document).ready(function() {
				$('table').tablesort();
		    });
		</script>
	</body>
</html>`,
		contentType: 'text/html; charset=utf-8',
		status
	};
}
/*
<script type="text/javascript" src="${assetUrl({path: 'scripts.js'})}"></script>
*/
