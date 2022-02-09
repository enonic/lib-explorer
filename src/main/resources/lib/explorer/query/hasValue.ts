import {forceArray} from '@enonic/js-utils';


export function hasValue<Value>(
	field :string,
	values :Value|Array<Value>
) {
	return {
		hasValue: {
			field,
			values: forceArray(values)
		}
	};
}
