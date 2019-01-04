import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {assetUrl} from '/lib/xp/portal';


export function createOrEditCollectionPage({
	path
}) {
	return htmlResponse({
		bodyEnd: [
			`<script type="text/javascript" src="${assetUrl({path: 'react/react.production.min.js'})}"></script>`,
			`<script type="text/javascript" src="${assetUrl({path: 'react-dom/react-dom.production.min.js'})}"></script>`,
			`<script type="text/javascript" src="${assetUrl({path: 'react/Collection.js'})}"></script>`,
			`<script type="text/javascript">
	ReactDOM.render(
		React.createElement(window.yase.Collection),
		document.getElementById('collection')
	);
</script>`
		],
		main: '<div id="collection"/>',
		path,
		title: 'Create or edit collection'
	});
}
