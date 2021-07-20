import {forceArray} from '@enonic/js-utils';


export function hasValue(
	field,
	values
) {
	return {
		hasValue: {
			field,
			values: forceArray(values)
		}
	};
}
