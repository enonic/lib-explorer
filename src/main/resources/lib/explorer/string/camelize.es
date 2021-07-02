import {camelize as jsUtilsCamelize} from '@enonic/js-utils';


export function camelize (s, r) {
	log.warning('/lib/explorer/string/camelize is DEPRECATED, use @enonic/js-utils instead!');
	return jsUtilsCamelize(s, r);
}
