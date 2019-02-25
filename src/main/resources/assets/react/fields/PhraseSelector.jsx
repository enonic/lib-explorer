import {getIn} from 'formik';
import {Select} from '../elements/Select';

//import {toStr} from '../utils/toStr';


export const PhraseSelector = ({
	//label, // in rest
	multiple = false,
	name = `phrase${multiple ? 's' : ''}`,
	options = [],
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	placeholder,
	defaultValue = placeholder ? '' : options[0].value,
	//setFieldValue, // in rest
	phrases = options,
	values,
	value = values && getIn(values, path) || defaultValue,
	...rest
}) => {
	//console.log(toStr({rest}));
	return <Select
		multiple={multiple}
		name={path}
		options={phrases}
		placeholder={placeholder}
		value={value}
		{...rest}
	/>;
} // PhraseSelector
