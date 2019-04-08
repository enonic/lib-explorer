import traverse from 'traverse';

//import {toStr} from '/lib/enonic/util';
import {isSet} from '/lib/enonic/util/value';
import {assetUrl} from '/lib/xp/portal';

import {connect} from '/lib/enonic/yase/repo/connect';
import {
	PRINCIPAL_YASE_READ,
	TOOL_PATH
} from '/lib/enonic/yase/constants';

import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {menu} from '/lib/enonic/yase/admin/collections/menu';
import {getFields} from '/lib/enonic/yase/admin/fields/getFields';
import {getFieldValues} from '/lib/enonic/yase/admin/fields/getFieldValues';


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
}


export function newOrEdit({
	path
}) {
	const relPath = path.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	const action = pathParts[1];
	const collectionName = pathParts[2];
	let initialValues;
	const connection = connect({
		principals: [PRINCIPAL_YASE_READ]
	});
	if (action === 'edit') {
		//log.info(toStr({collectionName}));

		const node = connection.get(`/collections/${collectionName}`);
		//log.info(toStr({node}));

		const {displayName, collector, cron, doCollect} = node;
		convert(collector);
		if(!collector.config.urls.length) {
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
		fields: fieldsObj,
		initialValues
	};
	//log.info(toStr({propsObj}));

	const propsJson = JSON.stringify(propsObj);
	//log.info(toStr({propsJson}));

	return htmlResponse({
		bodyBegin: [
			menu({path})
		],
		bodyEnd: [
			`<script type="text/javascript">
	ReactDOM.render(
		React.createElement(window.yase.Collection, ${propsJson}),
		document.getElementById('${ID_REACT_COLLECTION_CONTAINER}')
	);
	$('.ui.sticky').sticky({
    context: '#stickyContext'
  })
;
</script>`
		],
		main: `<div class="ui segment" id="stickyContext">
	<div class="ui left very close rail">
  	<div class="sticky vertical ui menu">
      <a class="item" href="#top">Menu <i class="angle double up icon"></i></a>
			<a class="item"href="#name">Name</a>
			<a class="item" href="#uris">Uris</a>
			<a class="item" href="#crawl">Crawl</a>
  	</div>
	</div>
	<div id="${ID_REACT_COLLECTION_CONTAINER}"/>
</div>`,
		path,
		title: 'Create or edit collection'
	});
}
