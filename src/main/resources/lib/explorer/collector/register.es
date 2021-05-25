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
	componentPath, // window.MyLibraryName.ComponentName
	configAssetPath = 'js/react/Collector.esm.js',
	displayName
}) {
	log.warning(`collector/register has been deprecated, please include a src/main/resources/collectors.json instead.
Example: [{
	"componentPath": "${componentPath}",
	"configAssetPath": "${configAssetPath}",
	"displayName": "${displayName}",
	"taskName": "${collectTaskName}"
}]`);
	const writeConnection = connect({
		principals: [PRINCIPAL_EXPLORER_WRITE]
	});
	const params = {
		__connection: writeConnection,
		__user: {
			key: USER_EXPLORER_APP_KEY
		},
		__sanitize: false,
		_parentPath: '/collectors',
		_name: `${appName}:${collectTaskName}`,
		appName,
		collectTaskName,
		componentPath,
		configAssetPath,
		displayName,
		type: NT_COLLECTOR
	};
	return createOrModify(params);
}
