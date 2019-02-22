import {getIn} from 'formik';
import {Select} from '../elements/Select';

//import {toStr} from '../utils/toStr';


export const FieldSelector = ({
	//label, // in rest
	multiple = false,
	name = `field${multiple ? 's' : ''}`,
	options = [],
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	placeholder = 'Please select a field',
	//setFieldValue, // in rest
	fields = options,
	values,
	value = values && getIn(values, path) || '',
	...rest
}) => {
	//console.log(toStr({rest}));
	return <Select
		multiple={multiple}
		name={path}
		options={fields}
		placeholder={placeholder}
		value={value}
		{...rest}
	/>;
} // FieldSelector
