import type {
	Collector,
	RepoConnection
} from '../types.d';

import {
	addQueryFilter,
	// toStr
} from '@enonic/js-utils';

import {
	NT_COLLECTOR//,
	//PATH_COLLECTORS
} from '/lib/explorer/model/2/constants';
import {list as getInstalledCollectors} from '/lib/explorer/collector/list';
import {hasValue} from '/lib/explorer/query/hasValue';


export function query({
	connection // Connecting many places leeds to loss of control over principals, so pass a connection around.
} :{
	connection :RepoConnection
}) {
	//log.warning(`/lib/explorer/collector/query is deprecated. Use /lib/explorer/collector/list instead.`);
	const filters = addQueryFilter({
		filter: hasValue('_nodeType', [NT_COLLECTOR])
	});
	const queryParams = {
		count: -1,
		filters,
		query: "_parentPath = '/collectors'"
	};
	//log.debug(`queryParams:${toStr({queryParams})}`);

	const collectorsReq = connection.query(queryParams);
	//log.info(`collectorsReq:${toStr({collectorsReq})}`);

	const collectorArray = collectorsReq.hits.map(hit => connection.get(hit.id) as Collector);
	//log.info(`collectorArray:${toStr({collectorArray})}`);

	const collectorsObj :{
		[key :string] :Collector
	} = {};
	collectorArray.forEach(({
		appName,
		//@ts-ignore
		collectTaskName: taskName, // WARNING: The collector nodes had collectTaskName, not taskName
		componentPath,
		configAssetPath,
		displayName
	}) => {
		collectorsObj[`${appName}:${taskName}`] = {
			appName,
			taskName,
			componentPath,
			configAssetPath,
			displayName
		};
	});
	//log.info(`collectorsObj:${toStr({collectorsObj})}`);

	const installedCollectors = getInstalledCollectors();
	//log.info(`installedCollectors:${toStr({installedCollectors})}`);

	installedCollectors.forEach(({
		componentPath,
		configAssetPath,
		displayName,
		taskName,
		appName
	}) => {
		collectorsObj[`${appName}:${taskName}`] = {
			appName,
			componentPath,
			configAssetPath,
			displayName,
			taskName
		};
	});
	//log.info(`collectorsObj:${toStr({collectorsObj})}`);

	const collectorIds = Object.keys(collectorsObj).sort();
	const collectorQueryResponse = {
		count: collectorIds.length,
		hits: collectorIds.map(k => collectorsObj[k]),
		total: collectorIds.length
	}

	//log.info(`collectorQueryResponse:${toStr({collectorQueryResponse})}`);
	return collectorQueryResponse;
}
