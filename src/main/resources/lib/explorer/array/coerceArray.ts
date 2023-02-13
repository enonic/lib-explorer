import {isSet} from '@enonic/js-utils';


export function coerceArray<Value>(v: Value|Value[]): Value[] {
	return isSet(v)
		? Array.isArray(v) ? v : [v]
		: [];
}
