//import {toStr} from '/lib/enonic/util';
import {assetUrl} from '/lib/xp/portal';

import {connectRepo} from '/lib/enonic/yase/connectRepo';
import {TOOL_PATH} from '/lib/enonic/yase/constants';

import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {getFields} from '/lib/enonic/yase/admin/fields/getFields';
import {getTags} from '/lib/enonic/yase/admin/tags/getTags';


const ID_REACT_COLLECTION_CONTAINER = 'reactCollectionContainer';


export function createOrEditCollectionPage({
	path
}) {
	const relPath = path.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	let initialValues;
	if (pathParts[1] !== 'createform') {
		const collectionName = pathParts[1];
		//log.info(toStr({collectionName}));

		const connection = connectRepo();
		const node = connection.get(`/collections/${collectionName}`)
		//log.info(toStr({node}));

		const {collector} = node;
		//log.info(toStr({collector}));

		if (collector.name === 'surgeon' && (!collector.config.urls || !collector.config.urls.length)) {
			collector.config.urls = [''];
		}

		initialValues = {
			name: collectionName,
			collector
		};
	}

	const fields = getFields().hits.map(({displayName, key}) => ({label: displayName, value: key}));
	//log.info(toStr({fields}));

	const tags = getTags().hits.map(({displayName, _path}) => ({label: displayName, value: _path.replace(/^\/tags\//, '')}));
	//log.info(toStr({tags}));

	const propsObj = {action: `${TOOL_PATH}/collections`, fields, initialValues, tags};
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
