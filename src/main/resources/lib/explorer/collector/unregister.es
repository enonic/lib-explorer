import {
	EVENT_COLLECTOR_UNREGISTER
} from '/lib/explorer/model/2/constants';

import {toStr} from '/lib/util';
import {isMaster} from '/lib/xp/cluster';
import {send} from '/lib/xp/event';

/*
 When an app is stopped, that app's disposer is run.

 However if the code inside the disposer takes time,
 it will throw out of bundlecontext.

 So the idea here is to let the separate collector app simply send an event,
 and let the still running main app-explorer receive the event and unregister
 the collector.

 When a cluster is in failover there may be a split brain situation with multiple masters.
 We want the cluster nodes that are still good to continue working,
 and we want the "borked" cluster nodes to stop doing stuff.

 Let's say we have this situation:

  Cluster node A (collector app is running as always)
  Cluster node B (master)

  Cluster node X (collector app is stopped)
  Cluster node Y (split brain master)

 Is it currently possible for Cluster node X to send
 an event that only Cluster node Y picks up? I don't think so.

 So the best I've come up with is
  to send a local event on all the cluster nodes
  and setup an event listener the master node, that only listens to local events
  and unregisters the collector (if it's not already deleted)
*/

export function unregister({
	appName,
	collectTaskName = 'collect'
}) {
	//log.warning(`collector/unregister has been deprecated, please include a src/main/resources/collectors.json instead.`);

	const event = {
		type: EVENT_COLLECTOR_UNREGISTER,
		distributed: false, // keep it local
		data: {
			collectorId: `${appName}:${collectTaskName}`
		}
	};

	// This will be in the log on all nodes...
	log.debug(`Sending event:${toStr(event)} isMaster:${isMaster}`);

	send(event);
}
