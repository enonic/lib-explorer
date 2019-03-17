import {isFunction, isString} from '/lib/enonic/util/value';

export function ucFirst(string) {
	if(!isString(string) || !isFunction(string.charAt)) {
		return string;
	}
	return `${string.charAt(0).toUpperCase()}${string.substr(1)}`
}
