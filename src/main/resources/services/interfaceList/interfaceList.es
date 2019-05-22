import {
	PRINCIPAL_YASE_READ,
	RT_JSON
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {query} from '/lib/enonic/yase/interface/query';


export function get() {
	const connection = connect({ principals: [PRINCIPAL_YASE_READ] });
	const interfaces = query({connection});
	interfaces.hits = interfaces.hits.map(({_name: name, displayName}) => ({displayName, name}));
	return {
		body: interfaces,
		contentType: RT_JSON
	};
}
