import traverse from 'traverse';

//import {toStr} from '/lib/enonic/util';
import {assetUrl} from '/lib/xp/portal';

import {connectRepo} from '/lib/enonic/yase/connectRepo';
import {TOOL_PATH} from '/lib/enonic/yase/constants';

import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {getFields} from '/lib/enonic/yase/admin/fields/getFields';
import {getFieldValues} from '/lib/enonic/yase/admin/fields/getFieldValues';
import {getTags} from '/lib/enonic/yase/admin/tags/getTags';


const ID_REACT_COLLECTION_CONTAINER = 'reactCollectionContainer';

function convert(node) {
	traverse(node).forEach(function(value) { // Fat arrow destroys this
		const key = this.key;
		//log.info(toStr({key}));
		if([
			'crawl',
			'download',
			'headers',
			'queryParams',
			'scrape',
			'tags',
			'urls',
		].includes(key)) {
			if (!value) {
				this.update([]);
			} else if (!Array.isArray(value)) {
				const array = [value];
				convert(array); // Recurse
				this.update(array);
			}
		}
	});
}


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
		const node = connection.get(`/collections/${collectionName}`);
		//log.info(toStr({node}));

		const {displayName, collector} = node;
		convert(collector);
		if(!collector.config.urls.length) {
			collector.config.urls.push('');
		}
		//log.info(toStr({collector}));

		initialValues = {
			name: displayName,
			collector
		};
	}
	//log.info(toStr({initialValues}));

	const fieldValuesArray = getFieldValues().hits;
	const fieldValuesObj = {};
	fieldValuesArray.forEach(({
		_name: name,
		_path: path,
		displayName: label,
		field
	}) => {
		if (!fieldValuesObj[field]) {fieldValuesObj[field] = {}}
		fieldValuesObj[field][name] = {
			label,
			path
		};
	});

	const fieldsArr = getFields().hits.map(({
		_path: path,
		displayName: label,
		key: value
	}) => ({label, value, path}));
	const fieldsObj = {};
	fieldsArr.forEach(({label, path, value: field}) => {
		fieldsObj[field] = {
			label,
			path,
			values: fieldValuesObj[field]
		};
	});
	//log.info(toStr({fields}));

	const tags = {};
	getTags().hits.forEach(({displayName: label, field, _name: value}) => {
		if(tags[field]) {
			tags[field].push({label, value});
		} else {
			tags[field] = [{label, value}];
		}
	});
	//log.info(toStr({tags}));

	const propsObj = {
		action: `${TOOL_PATH}/collections`,
		fields: fieldsArr,
		fieldsObj,
		initialValues,
		tags
	};
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
