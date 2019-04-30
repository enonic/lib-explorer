import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';

import {TOOL_PATH} from '/lib/enonic/yase/constants';


const ID_REACT_STOP_WORDS_CONTAINER = 'reactStopWordsContainer';


export function newOrEdit({
	path
}) {
	const relPath = path.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	const action = pathParts[1];
	const name = action === 'edit' ? pathParts[2] : '';

	const propsObj = {
		action: `${TOOL_PATH}/stopwords/${name ? `update/${name}` : 'create'}`,
		initialValues: {
			name,
			words: []
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
