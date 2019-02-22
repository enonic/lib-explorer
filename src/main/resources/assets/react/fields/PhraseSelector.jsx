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
	//placeholder, // in rest
	//setFieldValue, // in rest
	phrases = options,
	values,
	value = values && getIn(values, path) || '',
	...rest
}) => {
	//console.log(toStr({rest}));
	return <Select
		multiple={multiple}
		name={path}
		options={phrases}
		value={value}
		{...rest}
	/>;
} // PhraseSelector
