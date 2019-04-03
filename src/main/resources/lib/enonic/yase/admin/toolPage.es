//import {toStr} from '/lib/enonic/util';
import {serviceUrl} from '/lib/xp/portal';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {query as queryCollections} from '/lib/enonic/yase/collection/query';
import {query as getThesauri} from '/lib/enonic/yase/thesaurus/query';

const ID_REACT_SEARCH_CONTAINER = 'reactSearchContainer';


export function toolPage({
	path
}) {
	const collectionHits = queryCollections().hits;
	const propsObj = {
		collectionOptions: collectionHits.map(({displayName: label, _name: value}) => ({label, value})),
		initialValues: {
			collections: collectionHits.map(({_name}) => _name),
			thesauri: []
		},
		serviceUrl: serviceUrl({
			service: 'search',
			params: {
				interface: 'helsebiblioteket' // TODO
			}
		}),
		thesaurusOptions: getThesauri().hits.map(({displayName, name}) => ({label: displayName, value: name}))
	};
	//log.info(toStr({propsObj}));
	const propsJson = JSON.stringify(propsObj);
	return htmlResponse({
		bodyEnd: [
			`<script type="text/javascript">
	ReactDOM.render(
		React.createElement(window.yase.Search, ${propsJson}),
		document.getElementById('${ID_REACT_SEARCH_CONTAINER}')
	);
</script>`],
		main: `<div id="${ID_REACT_SEARCH_CONTAINER}"/>`,
		path
	});
}
