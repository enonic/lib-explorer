import {forceArray} from '/lib/enonic/util/data';
import {assetUrl} from '/lib/xp/portal';

import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {queryCollections} from '/lib/enonic/yase/admin/collections/queryCollections';
import {getFields} from '/lib/enonic/yase/admin/fields/getFields';
import {getFieldValues} from '/lib/enonic/yase/admin/fields/getFieldValues';
import {getTags} from '/lib/enonic/yase/admin/tags/getTags';
import {getThesauri} from '/lib/enonic/yase/admin/thesauri/getThesauri';


const ID_REACT_INTERFACE_CONTAINER = 'reactInterfaceContainer';


export function createOrEditInterfacePage({
	path
}) {
	const relPath = path.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));

	let initialValues;
	if (pathParts[1] !== 'createform') {
		const interfaceName = pathParts[1];
		const connection = connectRepo();
		const node = connection.get(`/interfaces/${interfaceName}`)
		const name = node.name || '';
		const collections = node.collections ? forceArray(node.collections) : []
		const thesauri = node.thesauri ? forceArray(node.thesauri) : []
		const {
			facets = [],
			filters,
			query,
			resultMappings,
			pagination
		} = node;
		initialValues = {
			name,
			collections,
			filters,
			query,
			resultMappings,
			facets,
			pagination,
			thesauri
		};
	}

	const tags = {};
	getTags().hits.forEach(({displayName: label, field, _path: value}) => {
		const key = `/fields/${field}`;
		//const value = _path.replace(/^\/tags\//, '');
		if(tags[key]) {
			tags[key].push({label, value});
		} else {
			tags[key] = [{label, value}];
		}
	});

	const fieldValuesArray = getFieldValues().hits;
	const fieldValuesObj = {};
	fieldValuesArray.forEach(({_name, _path, displayName, field}) => {
		/*if (!fieldValuesObj[field]) {fieldValuesObj[field] = []}
		fieldValuesObj[field].push({
			label: displayName,
			value: _name,
			path: _path
		});*/
		if (!fieldValuesObj[field]) {fieldValuesObj[field] = {}}
		fieldValuesObj[field][_name] = {
			label: displayName,
			path: _path
		};
	});

	const fieldsArray = getFields().hits.map(({displayName, key, _path}) => ({
		label: displayName,
		path: _path,
		value: key,
		values: fieldValuesObj[key]
	}));
	const fieldsObj = {};
	fieldsArray.forEach(({label, path, value, values}) => {
		fieldsObj[value] = {
			label, path, values
		};
	});

	const propsObj = {
		action: `${TOOL_PATH}/interfaces`,
		collections: queryCollections().hits.map(({displayName: label, _name: value}) => ({label, value})),
		fields: fieldsArray,
		fieldsObj,
		tags,
		thesauri: getThesauri().map(({displayName, name}) => ({label: displayName, value: name})),
		initialValues
	};

	const propsJson = JSON.stringify(propsObj);

	return htmlResponse({
		bodyEnd: [
			//`<script type="text/javascript" src="${assetUrl({path: 'react/react.production.min.js'})}"></script>`,
			`<script type="text/javascript" src="${assetUrl({path: 'react/react.development.js'})}"></script>`,
			//`<script type="text/javascript" src="${assetUrl({path: 'react-dom/react-dom.production.min.js'})}"></script>`,
			`<script type="text/javascript" src="${assetUrl({path: 'react-dom/react-dom.development.js'})}"></script>`,
			`<script type="text/javascript" src="${assetUrl({path: 'yase.js'})}"></script>`,
			`<script type="text/javascript">
	ReactDOM.render(
		React.createElement(window.yase.Interface, ${propsJson}),
		document.getElementById('${ID_REACT_INTERFACE_CONTAINER}')
	);
</script>`
		],
		main: `<div id="${ID_REACT_INTERFACE_CONTAINER}"/>`,
		path,
		title: 'Create or edit interface'
	});
} // function createOrEditInterfacePage
