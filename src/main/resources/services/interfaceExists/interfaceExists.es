import {
	PRINCIPAL_YASE_READ
} from '/lib/enonic/yase/constants';
import {exists} from '/lib/enonic/yase/interface/exists';
import {connect} from '/lib/enonic/yase/repo/connect';


export function get({
	params: {
		name
	}
}) {
	return {
		body: {
			exists: exists({
				connection: connect({principals: [PRINCIPAL_YASE_READ]}),
				name
			})
		},
		contentType: 'text/json; charset=utf-8'
	};
}
