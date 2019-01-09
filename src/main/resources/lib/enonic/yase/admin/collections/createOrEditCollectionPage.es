//import {toStr} from '/lib/enonic/util';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {assetUrl} from '/lib/xp/portal';

const ID_REACT_COLLECTION_CONTAINER = 'reactCollectionContainer';

export function createOrEditCollectionPage({
	path
}) {
	const propsObj = {
		name: 'testName',
		urls: [
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
		/*headers: {
			'Accept-Language': 'nb-NO'
		},*/
		headers: [{
			name: 'Accept-Language',
			value: 'nb-NO'
		}],
		delay: 1000, // ms
		node: {
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
		}
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
