import {connect, getIn} from 'formik';
import {Input as SemanticUiReactInput} from 'semantic-ui-react';


export const Input = connect(({
	// React
	type = 'text',

	// Various before formik onChange
	name,
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,

	// Formik
	formik: {
		setFieldValue,
		values
	},
	onChange = (event, {
		value: newValue
	}) => {
		//console.debug({event, newValue});
		setFieldValue(path, newValue);
	},

	// Various after formik values
	defaultValue = getIn(values, path, ''),

	...rest
}) => <SemanticUiReactInput
	defaultValue={defaultValue}
	name={path}
	onChange={onChange}
	type={type}
	{...rest}
/>);
