import {forceArray} from '/lib/enonic/util/data';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';

import {
	PRINCIPAL_YASE_READ,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {get} from '/lib/enonic/yase/stopWords/get';

const ID_REACT_STOP_WORDS_CONTAINER = 'reactStopWordsContainer';


export function newOrEdit({
	path
}) {
	const relPath = path.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	const action = pathParts[1];
	const name = action === 'edit' ? pathParts[2] : '';

	const connection = connect({principals: [PRINCIPAL_YASE_READ]});
	const node = name ? get({connection, name}) : {
		displayName: name,
		words: []
	};
	const {displayName = name, words} = node;

	const propsObj = {
		action: `${TOOL_PATH}/stopwords/${name ? `update/${name}` : 'create'}`,
		initialValues: {
			displayName,
			name,
			words: forceArray(words)
		},
		mode: action
	};
	const propsJson = JSON.stringify(propsObj);
	return htmlResponse({
		bodyEnd: [
			`<script type="text/javascript">
	ReactDOM.render(
		React.createElement(window.yase.StopWords, ${propsJson}),
		document.getElementById('${ID_REACT_STOP_WORDS_CONTAINER}')
	);
</script>`],
		main: `<div id="${ID_REACT_STOP_WORDS_CONTAINER}"/>`,
		path,
		title: action === 'edit' ? `Edit stop words list ${name}` : 'Create new stop words list'
	});
}
