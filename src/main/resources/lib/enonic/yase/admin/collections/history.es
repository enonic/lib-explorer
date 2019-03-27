import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {menu} from '/lib/enonic/yase/admin/collections/menu';


export const history = ({
	path
}) => {
	return htmlResponse({
		bodyBegin: [
			menu({path})
		],
		path,
		title: 'History'
	})
} // history
