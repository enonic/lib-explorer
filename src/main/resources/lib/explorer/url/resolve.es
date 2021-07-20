//import {toStr} from '@enonic/js-utils';
import {resolve as _resolve} from 'uri-js';


export function resolve({base, uri}) {
	//log.info(toStr({base, uri}));
	return _resolve(base, uri);
}
