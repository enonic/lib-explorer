import {ucFirst as jsUtilsUcFirst} from '@enonic/js-utils';


export function ucFirst(s :string) :string {
	log.warning('/lib/explorer/ucFirst is DEPRECATED, use @enonic/js-utils instead!');
	return jsUtilsUcFirst(s);
}
