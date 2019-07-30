import {
	NT_COLLECTOR,
	PRINCIPAL_EXPLORER_WRITE,
	USER_EXPLORER_APP_KEY
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {createOrModify} from '/lib/explorer/node/createOrModify';


export function register({
	appName,
	collectTaskName = 'collect',
	configAssetPath = 'yase/Collector.js',
	displayName
}) {
	const yaseWriteConnection = connect({
		principals: [PRINCIPAL_EXPLORER_WRITE]
	});
	const params = {
		__connection: yaseWriteConnection,
		__user: {
			key: USER_EXPLORER_APP_KEY
		},
		_parentPath: '/collectors',
		_name: appName,
		collectTaskName,
		configAssetPath,
		displayName,
		type: NT_COLLECTOR
	};
	return createOrModify(params);
}
