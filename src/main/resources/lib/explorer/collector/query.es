import {
	NT_COLLECTOR//,
	//PATH_COLLECTORS
} from '/lib/explorer/model/2/constants';
import {list as getInstalledCollectors} from '/lib/explorer/collector/list';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
//import {toStr} from '/lib/util';


export function query({
	connection // Connecting many places leeds to loss of control over principals, so pass a connection around.
} = {}) {
	//log.warning(`/lib/explorer/collector/query is deprecated. Use /lib/explorer/collector/list instead.`);
	const filters = addFilter({
		clause: 'should',
		filter: hasValue('_nodeType', [NT_COLLECTOR])
	});
	addFilter({
		clause: 'should',
		filter: hasValue('type', [NT_COLLECTOR]),
		filters
	});
	const queryParams = {
		count: -1,
		filters,
		query: "_parentPath = '/collectors'"
	};
	//log.debug(`queryParams:${toStr({queryParams})}`);

	const collectorsReq = connection.query(queryParams);
	collectorsReq.hits = collectorsReq.hits.map(hit => connection.get(hit.id));
	//log.debug(`collectorsReq:${toStr({collectorsReq})}`);

	const collectorsObj = {};
	collectorsReq.hits.forEach(({
		appName,
		collectTaskName,
		componentPath,
		configAssetPath,
		displayName
	}) => {
		collectorsObj[`${appName}:${collectTaskName}`] = {
			appName,
			collectTaskName,
			componentPath,
			configAssetPath,
			displayName
		};
	});

	const installedCollectors = getInstalledCollectors();
	//log.debug(`installedCollectors:${toStr({installedCollectors})}`);

	installedCollectors.forEach(({
		componentPath,
		configAssetPath,
		displayName,
		taskName: collectTaskName,
		appName
	}) => {
		collectorsObj[`${appName}:${collectTaskName}`] = {
			appName,
			collectTaskName,
			componentPath,
			configAssetPath,
			displayName
		};
	});

	collectorsReq.hits = Object.keys(collectorsObj).sort().map(k => collectorsObj[k]);
	collectorsReq.count = collectorsReq.hits.length;
	collectorsReq.total = collectorsReq.hits.length;

	//log.debug(`collectorsReq spliced:${toStr({collectorsReq})}`);
	return collectorsReq;
}
