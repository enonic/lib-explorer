import {isString} from '/lib/enonic/util/value';


function isFunction(value) {
	return !!(value && value.constructor && value.call && value.apply); // highly performant from underscore
}


export function ucFirst(string) {
	if(!isString(string) || !isFunction(string.charAt)) {
		return string;
	}
	return `${string.charAt(0).toUpperCase()}${string.substr(1)}`
}
