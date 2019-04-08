import traverse from 'traverse';
import generateUuidv4 from 'uuid/v4';

import {forceArray} from '/lib/enonic/util/data';
import {isString} from '/lib/enonic/util/value';
import {assetUrl} from '/lib/xp/portal';

import {
	PRINCIPAL_YASE_READ,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {query as queryCollections} from '/lib/enonic/yase/collection/query';
import {getFields} from '/lib/enonic/yase/admin/fields/getFields';
import {getFieldValues} from '/lib/enonic/yase/admin/fields/getFieldValues';
import {getTags} from '/lib/enonic/yase/admin/tags/getTags';
import {query as getThesauri} from '/lib/enonic/yase/thesaurus/query';


const ID_REACT_INTERFACE_CONTAINER = 'reactInterfaceContainer';


function convert({object, fields, recurse = true}) {
	traverse(object).forEach(function(value) { // Fat arrow destroys this
		const key = this.key;
		if (fields.includes(key)) {
			if (!value) {
				this.update([]);
			} else if (!Array.isArray(value)) { // Convert single value to array
				const array = [value];
				if (recurse) {
					convert({array, fields, recurse}); // Recurse
				}
				this.update(array);
			} else if (Array.isArray(value)) {
				this.update(value.map(entry => {
					if (!isString(entry) && !entry.uuid4) {
						entry.uuid4 = generateUuidv4();
					}
					return entry;
				}));
			} // if isArray
		} // if key
	}); // traverse
	return object;
} // convert


export function newOrEdit({
	path
}) {
	const relPath = path.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	const action = pathParts[1];
	const interfaceName = pathParts[2];

	const connection = connect({
		principals: [PRINCIPAL_YASE_READ]
	});

	let initialValues;
	if (action === 'edit') {
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
		initialValues = convert({
			object: {
				name,
				collections,
				filters,
				query,
				resultMappings,
				facets,
				pagination,
				thesauri
			},
			fields: [
				'expressions',
				'facets',
				'fields',
				'must',
				'mustNot',
				'resultMappings',
				'thesauri',
				'values'
			]
		});
	} // action === edit

	const tags = {};
	getTags({connection}).hits.forEach(({displayName: label, field, _path: value}) => {
		const key = `/fields/${field}`;
		//const value = _path.replace(/^\/tags\//, '');
		if(tags[key]) {
			tags[key].push({label, value});
		} else {
			tags[key] = [{label, value}];
		}
	});

	const fieldValuesArray = getFieldValues({connection}).hits;
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

	const fieldsArray = getFields({connection}).hits.map(({displayName, key, _path}) => ({
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
		action: `${TOOL_PATH}/interfaces/${action === 'edit' ? `update/${interfaceName}` : 'create'}`,
		collections: queryCollections({connection}).hits.map(({displayName: label, _name: value}) => ({label, value})),
		fields: fieldsArray,
		fieldsObj,
		tags,
		thesauriOptions: getThesauri({connection}).hits.map(({displayName, name}) => ({
			key: name,
			//label: displayName,
			text: displayName,
			value: name
		})),
		initialValues
	};

	const propsJson = JSON.stringify(propsObj);

	return htmlResponse({
		bodyEnd: [
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
} // function newOrEdit
