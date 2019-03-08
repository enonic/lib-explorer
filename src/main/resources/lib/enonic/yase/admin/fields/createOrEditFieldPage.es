import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export function createOrEditFieldPage() {
	return htmlResponse({
		main: `<form></form>`
	});
}
