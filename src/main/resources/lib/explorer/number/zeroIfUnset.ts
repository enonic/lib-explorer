import {isSet} from '@enonic/js-utils';


export function zeroIfUnset<Value>(v: Value): Value|number {
	return isSet(v) ? v : 0;
}
