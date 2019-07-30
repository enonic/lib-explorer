import {
	NT_COLLECTOR,
	PRINCIPAL_EXPLORER_WRITE,
	USER_YASE_JOB_RUNNER_KEY
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {remove} from '/lib/explorer/node/remove';


export function unregister({
	appName
}) {
	const yaseWriteConnection = connect({
		principals: [PRINCIPAL_EXPLORER_WRITE]
	});
	return remove({
		connection: yaseWriteConnection,
		_parentPath: '/collectors',
		_name: appName
	});
}
