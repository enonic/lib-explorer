import {
	PRINCIPAL_YASE_READ,
	RT_JSON
} from '/lib/enonic/yase/constants';
import {exists} from '/lib/enonic/yase/collection/exists';
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
		contentType: RT_JSON
	};
}
