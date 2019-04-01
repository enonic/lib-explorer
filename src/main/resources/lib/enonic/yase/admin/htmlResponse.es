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
	path = TOOL_PATH,
	title = '',
	status = 200
} = {}) {
	//log.info(toStr({path}));
	const relPath = path.replace(TOOL_PATH, ''); //log.info(toStr({relPath}));
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	const tab = pathParts ? pathParts[0] : ''; //log.info(toStr({tab}));
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
				<a class="item ${relPath === '' ? 'active' : ''}" href="${TOOL_PATH}""><i class="search icon"></i> YASE</a>
				<a class="item ${tab === 'collections' ? 'active' : ''}" href="${TOOL_PATH}/collections"><i class="database icon"></i> Collections</a>
				<a class="item ${tab === 'fields' ? 'active' : ''}" href="${TOOL_PATH}/fields"><i class="sitemap icon"></i> Fields</a>
				<a class="item ${tab === 'tags' ? 'active' : ''}" href="${TOOL_PATH}/tags"><i class="tag icon"></i> Tags</a>
				<a class="item ${tab === 'thesauri' ? 'active' : ''}" href="${TOOL_PATH}/thesauri"><i class="font icon"></i> Thesauri</a>
				<a class="item ${tab === 'interfaces' ? 'active' : ''}" href="${TOOL_PATH}/interfaces"><i class="plug icon"></i> Interfaces</a>
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
