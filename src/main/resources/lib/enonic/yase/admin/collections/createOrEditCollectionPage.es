//import {toStr} from '/lib/enonic/util';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {assetUrl} from '/lib/xp/portal';


export function createOrEditCollectionPage({
	path
}) {
	const propsObj = {
		name: 'testName',
		url: [
			'https://www.example.com/first',
			'https://www.example.com/second'
		],
		pathRange: {
			min: 1,
			max: 2
		},
		queryRange: {
			name: 'page',
			min: 1,
			max: 2
		},
		headers: {
			'Accept-Language': 'nb-NO'
		},
		delay: 1000, // ms
		scrape: {/*
			nested: {
				field: 'dataExtractionExpression'
			}
		*/},
		download: [/*
			'urlExtractionExpression' ,...
		*/],
		crawl: null/*{
			urlExtractionExpression: 'urlExtractionExpression',
			dynamic: false,
			...
		}*/
	};
	//log.info(toStr({propsObj}));
	const propsJson = JSON.stringify(propsObj);
	//log.info(toStr({propsJson}));
	return htmlResponse({
		bodyEnd: [
			`<script type="text/javascript" src="${assetUrl({path: 'react/react.production.min.js'})}"></script>`,
			`<script type="text/javascript" src="${assetUrl({path: 'react-dom/react-dom.production.min.js'})}"></script>`,
			`<script type="text/javascript" src="${assetUrl({path: 'react/Collection.js'})}"></script>`,
			`<script type="text/javascript">
	ReactDOM.render(
		React.createElement(window.yase.Collection, ${propsJson}),
		document.getElementById('collection')
	);
</script>`
		],
		main: '<div id="collection"/>',
		path,
		title: 'Create or edit collection'
	});
}
