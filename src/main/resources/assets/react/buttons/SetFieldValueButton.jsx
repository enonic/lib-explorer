import {connect, getIn} from 'formik';

//import {toStr} from '../utils/toStr';


export const SetFieldValueButton = connect(({
	children,
	formik: {
		setFieldValue: formikSetFieldValue,
		values: formikValues
	} = {},
	name = '',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	field = path, // Backwards compatibility (should be cleaned up)
	setFieldValue = formikSetFieldValue,
	text,
	type, // So it doesn't end up in ...rest
	value,
	values = formikValues,
	onClick = () => {
		//console.debug(toStr({field, value}));
		setFieldValue(field, value)
	},
	...rest
}) => {
	//console.debug(toStr({parentPath, name, path, field, value}));
	return <button
		onClick={onClick}
		type="button"
		{...rest}
	>{children||text}</button>;
});
