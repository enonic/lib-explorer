export {register} from '/lib/explorer/collector/register';
export {unregister} from '/lib/explorer/collector/unregister';

export {Collector} from '/lib/explorer/collector/Collector';

/*

A collector must provide a react bundle for its configuration options,
and a task to do the actual collecting.

Multiple collectors may be present in a single Enonic XP application.

Since there is currently no js API to fetch running Enonic XP applications,
we have to implement a workaround in order to get available collectors.

Idea: When an Enonic XP application, which contains one or more collectors is
started, all the collectors in the app must be registered.

A registration consists of a node:
repo: com.enonic.app.explorer
path: '/collectors'
_name: `${app.name}:${collectTaskName}`
appName: `${app.name}`
type: 'com.enonic.app.explorer:collector'
displayName: 'Human readable collector name'
collectTaskName: `${collectTaskName}`
configAssetPath: 'js/react/Filename.esm.js'

TODO? iconAssetPath

The registration node is used in the following ways:

1. On startup of com.enonic.app.explorer a list of all collectors are fetched in
   order to reschedule all "cron jobs". (main.es)✅

2. On change of any collection config, a reschedule event is sent, and picked up
   by a listener and all "cron jobs" are rescheduled. (main.es)✅

3. When the Explorer admin app is visited, a list of all collectors are fetched
   in order to initialize every react bundle provided by a collector.
   (htmlResponse.es)✅

4. When creating or modifying a collection config. ✅

5. When manually triggering a collect job. ✅

6. When a cron job is executed. ✅

*/
