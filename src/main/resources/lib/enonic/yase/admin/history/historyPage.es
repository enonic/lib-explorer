import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export const historyPage = ({
	path
}) => {
	return htmlResponse({
		path,
		title: 'History'
	})
} // historyPage
