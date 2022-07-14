export * from '/lib/explorer/constants'; // ReferenceError: "APP_EXPLORER" is not defined
/*export {
	APP_EXPLORER
} from '/lib/explorer/constants';*/

//export {list as getApplications} from '/lib/explorer/application';
export {create, update} from '/lib/explorer/document';
export {register, unregister, Collector} from '/lib/explorer/collector';

//export * as repo from './repo';
