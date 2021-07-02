import {isObject as jsUtilsIsObject} from '@enonic/js-utils';


export function isObject(v) {
	log.warning('/lib/explorer/object/isObject is DEPRECATED, use @enonic/js-utils instead!');
	return jsUtilsIsObject(v);
}
