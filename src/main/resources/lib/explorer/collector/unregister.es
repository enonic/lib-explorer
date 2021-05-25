import {toStr} from '/lib/util';
import {send} from '/lib/xp/event';

import {
	EVENT_COLLECTOR_UNREGISTER//,
	//PRINCIPAL_EXPLORER_WRITE
} from '/lib/explorer/model/2/constants';
//import {connect} from '/lib/explorer/repo/connect';
//import {remove} from '/lib/explorer/node/remove';


export function unregister({
	appName,
	collectTaskName = 'collect'
}) {
	//log.warning(`collector/unregister has been deprecated, please include a src/main/resources/collectors.json instead.`);
	const event = {
		type: EVENT_COLLECTOR_UNREGISTER,
		distributed: false, // See comment at the EOF.
		data: {
			collectorId: `${appName}:${collectTaskName}`
		}
	};
	log.info(`Sending event ${toStr(event)}`);
	send(event);
	/*const writeConnection = connect({
		principals: [PRINCIPAL_EXPLORER_WRITE]
	});
	return remove({
		connection: writeConnection,
		_parentPath: '/collectors',
		_name: `${appName}:${collectTaskName}`
	});*/
}

/*
 Since there is no way to run code on failover, if you have multiple masters,
 you have to have an event listener on all nodes that checks inside the listener
 whether the node is currently the master.

 Since we have to have listeners on all nodes, lets avoid all of them having to
 do something. If we don't distribute the event, and let the local listener run
 the required code. The other listeners wont pick up anything to do :)
*/
