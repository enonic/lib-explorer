//import traverse from 'traverse';

import {toStr} from '/lib/enonic/util';
import {isSet} from '/lib/enonic/util/value';
import {assetUrl} from '/lib/xp/portal';

import {connect} from '/lib/enonic/yase/repo/connect';
import {
	NT_COLLECTOR,
	PRINCIPAL_YASE_READ,
	TOOL_PATH
} from '/lib/enonic/yase/constants';

import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {menu} from '/lib/enonic/yase/admin/collections/menu';
import {query as queryCollectors} from '/lib/enonic/yase/collector/query';
import {getFields} from '/lib/enonic/yase/admin/fields/getFields';
import {getFieldValues} from '/lib/enonic/yase/admin/fields/getFieldValues';


const ID_REACT_COLLECTION_CONTAINER = 'reactCollectionContainer';

/*function convert(node) {
	traverse(node).forEach(function(value) { // Fat arrow destroys this
		const key = this.key;
		//log.info(toStr({key}));
		if([
			'crawl',
			'download',
			'headers',
			'queryParams',
			'scrape',
			'scrapeExpression',
			'scrapeJson',
			'tags',
			'urls',
			'urlExpression'
			//'value' // Nope this will destroy headers[index].value
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
}*/


export function newOrEdit({
	path
}) {
	const relPath = path.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	const action = pathParts[1];
	const collectionName = pathParts[2];
	let initialValues = {
		name: '',
		collector: {
			config: {},
			name: ''
		},
		cron: [{
			month: '*',
			dayOfMonth: '*',
			dayOfWeek: '*',
			minute: '*',
			hour: '*'
		}]
	};
	const connection = connect({
		principals: [PRINCIPAL_YASE_READ]
	});

	const collectorsAppToUri = {};
	const collectorOptions = queryCollectors({
		connection
	}).hits.map(({_name: application, displayName, configAssetPath}) => {
		const uri = assetUrl({
			application,
			path: configAssetPath
		});
		collectorsAppToUri[application] = uri;
		return {
			key: application,
			text: displayName,
			value: application
		};
	});
	//log.info(toStr({collectorsAppToUri}));

	if (action === 'edit') {
		//log.info(toStr({collectionName}));

		const node = connection.get(`/collections/${collectionName}`);
		//log.info(toStr({node}));

		const {
			displayName,
			collector: {
				name: collectorName,
				configJson,
				config
			},
			cron = [{
				month: '*',
				dayOfMonth: '*',
				dayOfWeek: '*',
				minute: '*',
				hour: '*'
			}],
			doCollect
		} = node;

		const collector = {
			name: collectorName,
			config: configJson ? JSON.parse(configJson) : config
		};

		// TODO Remove after all collections are resaved.
		if (collector.name === 'surgeon') {
			collector.name = 'com.enonic.app.yase.collector.surgeon';
		}

		//convert(collector); // TODO Surgeon specific
		if (collector.name === 'com.enonic.app.yase.collector.surgeon' && !collector.config.urls.length) {
			collector.config.urls.push('');
		}
		//log.info(toStr({collector}));

		initialValues = {
			name: displayName,
			collector,
			cron,
			doCollect: isSet(doCollect) ? doCollect : true
		};
	}
	//log.info(toStr({initialValues}));

	const fieldValuesArray = getFieldValues({connection}).hits;
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

	const fieldsArr = getFields({connection}).hits.map(({
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
	//log.info(toStr({fieldsObj}));

	const propsObj = {
		action: `${TOOL_PATH}/collections/${action === 'edit' ? `update/${collectionName}` : 'create'}`,
		collectorOptions,
		collectorsAppToUri,
		fields: fieldsObj,
		initialValues
	};
	//log.info(toStr({propsObj}));

	const propsJson = JSON.stringify(propsObj);
	//log.info(toStr({propsJson}));

	const collectorUri = assetUrl({
		application: 'com.enonic.app.yase.collector.uptodate',
		path: 'react/Collector.esm.js'
	});

	return htmlResponse({
		bodyBegin: [
			menu({path})
		],
		main: `<div id="${ID_REACT_COLLECTION_CONTAINER}"/>`,
		bodyEnd: [
			`<script type='module' defer>
	import {Collection} from '${assetUrl({path: 'react/Collection.esm.js'})}'
	const collectorsObj = {};
	${Object.entries(collectorsAppToUri).map(([a, u], i) => `import {Collector as Collector${i}} from '${u}';
	collectorsObj['${a}'] = Collector${i};`
	).join('\n')}
	const propsObj = JSON.parse('${propsJson}');
	propsObj.collectorsObj = collectorsObj;
	ReactDOM.render(
		Collection(propsObj),
		document.getElementById('${ID_REACT_COLLECTION_CONTAINER}')
	);
</script>`
		],
		path,
		title: 'Create or edit collection'
	});
}
