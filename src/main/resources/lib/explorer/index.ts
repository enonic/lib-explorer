//export * from '/lib/explorer/constants'; // ReferenceError: "APP_EXPLORER" is not defined
export {
	APP_EXPLORER
} from '/lib/explorer/constants';

//export {list as getApplications} from '/lib/explorer/application';
export {create, update} from '/lib/explorer/document';
//export {search} from '/lib/explorer/client';
export {register, unregister, Collector} from '/lib/explorer/collector';

//export {create, update} from './document';
//export {search} from './client';
//export {register, unregister, Collector} from './collector';
