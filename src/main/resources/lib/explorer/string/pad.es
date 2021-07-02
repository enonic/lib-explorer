import {lpad} from '@enonic/js-utils';

export function pad(u, w, z) {
	log.warning('/lib/explorer/string/pad is DEPRECATED, use @enonic/js-utils/lpad instead!');
	return lpad(u, w, z);
}
