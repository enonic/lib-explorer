//import {toStr} from '/lib/enonic/util';
import {assetUrl} from '/lib/xp/portal';

import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {getFields} from '/lib/enonic/yase/admin/fields/getFields';


const ID_REACT_COLLECTION_CONTAINER = 'reactCollectionContainer';


export function createOrEditCollectionPage({
	path
}) {
	const fields = [{displayName: 'Please select a field', key: null}].concat(getFields().hits.map(({displayName, key}) => ({displayName, key})));
	const propsObj = {fields};
	//log.info(toStr({propsObj}));
	const propsJson = JSON.stringify(propsObj);
	//log.info(toStr({propsJson}));
	return htmlResponse({
		bodyEnd: [
			//`<script type="text/javascript" src="${assetUrl({path: 'react/react.production.min.js'})}"></script>`,
			`<script type="text/javascript" src="${assetUrl({path: 'react/react.development.js'})}"></script>`,
			//`<script type="text/javascript" src="${assetUrl({path: 'react-dom/react-dom.production.min.js'})}"></script>`,
			`<script type="text/javascript" src="${assetUrl({path: 'react-dom/react-dom.development.js'})}"></script>`,
			`<script type="text/javascript" src="${assetUrl({path: 'yase.js'})}"></script>`,
			`<script type="text/javascript">
	ReactDOM.render(
		React.createElement(window.yase.Collection, ${propsJson}),
		document.getElementById('${ID_REACT_COLLECTION_CONTAINER}')
	);
</script>`
		],
		main: `<div id="${ID_REACT_COLLECTION_CONTAINER}"/>`,
		path,
		title: 'Create or edit collection'
	});
}
