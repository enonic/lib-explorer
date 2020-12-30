import {forceArray} from '/lib/util/data';


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
