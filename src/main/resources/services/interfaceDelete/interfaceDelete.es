import {
	PRINCIPAL_YASE_WRITE,
	RT_JSON
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {remove} from '/lib/enonic/yase/interface/remove';


export function post({
	params: {
		name
	}
}) {
	const connection = connect({ principals: [PRINCIPAL_YASE_WRITE] });

	const res = remove({
		connection,
		name
	});

	return {
		body: res,
		contentType: RT_JSON,
		status: res.length ? 200 : 500
	};
}
