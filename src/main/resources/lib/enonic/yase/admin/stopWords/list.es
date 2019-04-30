import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';

import {TOOL_PATH} from '/lib/enonic/yase/constants';


export const list = ({
	params: {
		messages,
		status
	},
	path
}) => {
	return htmlResponse({
		main: `<a class="tiny compact ui button" href="${TOOL_PATH}/stopwords/new"><i class="green plus icon"></i> New stop words list</a>`,
		messages,
		path,
		status,
		title: 'Stop words'
	});
}
