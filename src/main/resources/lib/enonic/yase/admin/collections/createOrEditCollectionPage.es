import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {assetUrl} from '/lib/xp/portal';


export function createOrEditCollectionPage({
	path
}) {
	return htmlResponse({
		bodyEnd: [
			`<script type="text/javascript" src="${assetUrl({path: 'react/Collection.js'})}"></script>`
		],
		headBegin: [
			`<script type="text/javascript" src="${assetUrl({path: 'react/react.production.min.js'})}"></script>`,
			`<script type="text/javascript" src="${assetUrl({path: 'react-dom/react-dom.production.min.js'})}"></script>`,
		],
		main: '',
		path,
		title: 'Create or edit collection'
	});
}
