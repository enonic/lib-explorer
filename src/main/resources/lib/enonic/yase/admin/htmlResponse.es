import {TOOL_PATH} from '/lib/enonic/yase/constants';
//import {toStr} from '/lib/enonic/util';
import {assetUrl} from '/lib/xp/portal';


export function htmlResponse({
	bodyBegin = [],
	bodyEnd = [],
	headBegin = [],
	headEnd = [],
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
		${headEnd.join('\n')}
	</head>
	<body>
		<nav class="stackable tabular ui menu" id="top">
			<div class="ui container">
				<a class="item ${relPath === '' ? 'active' : ''}" href="${toolPath}""><i class="search icon"></i> YASE</a>
				<a class="item ${relPath.startsWith('/collections') ? 'active' : ''}" href="${toolPath}/collections"><i class="database icon"></i> Collections</a>
				<a class="item ${relPath.startsWith('/fields') ? 'active' : ''}" href="${toolPath}/fields"><i class="sitemap icon"></i> Fields</a>
				<a class="item ${relPath.startsWith('/tags') ? 'active' : ''}" href="${toolPath}/tags"><i class="tag icon"></i> Tags</a>
				<a class="item ${relPath.startsWith('/thesauri') ? 'active' : ''}" href="${toolPath}/thesauri"><i class="font icon"></i> Thesauri</a>
				<a class="item ${relPath.startsWith('/interfaces') ? 'active' : ''}" href="${toolPath}/interfaces"><i class="plug icon"></i> Interfaces</a>
				<!--div class="right item">
					<div class="ui input"><input type="text" placeholder="Search..."></div>
				</div-->
			</div>
		</nav>
		${bodyBegin.join('\n')}
		<main class="ui main container">
			${messages.length ? `<ul class="${status === 200 ? 'success' : 'error'}">${messages.map(m => `<li>${m}</li>`)}</ul>` : ''}
			${main}
		</main>

		<!--script type="text/javascript" src="${assetUrl({path: 'react/react.production.min.js'})}"></script-->
		<script type="text/javascript" src="${assetUrl({path: 'react/react.development.js'})}"></script>

		<!--script type="text/javascript" src="${assetUrl({path: 'react-dom/react-dom.production.min.js'})}"></script-->
		<script type="text/javascript" src="${assetUrl({path: 'react-dom/react-dom.development.js'})}"></script>

		<script type="text/javascript" src="${assetUrl({path: 'yase.js'})}"></script>
		<script type="text/javascript" src="${assetUrl({path: 'jquery/jquery.js'})}"></script>
		<script type="text/javascript">
			jQuery = $;
		</script>
		<script type="text/javascript" src="${assetUrl({path: 'semantic-ui/semantic.js'})}"></script>
		<script type="text/javascript" src="${assetUrl({path: 'js/tablesort.js'})}"></script>
		<script type="text/javascript">
			$(document).ready(function() {
				$('select.dropdown').dropdown();
				$('table').tablesort();
		    });
		</script>
		${bodyEnd.join('\n')}
	</body>
</html>`,
		contentType: 'text/html; charset=utf-8',
		status
	};
}
/*
$('.ui.checkbox').checkbox();
<script type="text/javascript" src="${assetUrl({path: 'scripts.js'})}"></script>
*/
