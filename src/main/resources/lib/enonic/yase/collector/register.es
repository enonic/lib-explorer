import {
	NT_COLLECTOR,
	PRINCIPAL_YASE_WRITE,
	USER_YASE_JOB_RUNNER_KEY
} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {createOrModify} from '/lib/enonic/yase/node/createOrModify';


export function register({
	appName,
	collectTaskName = 'collect',
	configAssetPath = 'yase/collectorConfig.js',
	displayName
}) {
	const yaseWriteConnection = connect({
		principals: [PRINCIPAL_YASE_WRITE]
	});
	const params = {
		__connection: yaseWriteConnection,
		__user: {
			key: USER_YASE_JOB_RUNNER_KEY
		},
		_parentPath: '/collectors',
		_name: appName,
		collectTaskName,
		configAssetPath,
		displayName,
		type: NT_COLLECTOR
	};
	createOrModify(params);
}
