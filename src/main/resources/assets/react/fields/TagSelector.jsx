import {getIn} from 'formik';
import {Select} from '../elements/Select';

//import {toStr} from '../utils/toStr';


export const TagSelector = ({
	//label, // in rest
	multiple = false,
	name = `tag${multiple ? 's' : ''}`,
	options = [],
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	//placeholder, // in rest
	//setFieldValue, // in rest
	tags = options,
	values,
	value = values && getIn(values, path) || '',
	...rest
}) => {
	//console.log(toStr({rest}));
	return <Select
		multiple={multiple}
		name={path}
		options={tags}
		value={value}
		{...rest}
	/>;
} // TagSelector
