import {connect, getIn} from 'formik';
import {Button} from './Button';
import {Icon} from '../icons/Icon';
//import {toStr} from '../utils/toStr';


export const SetFieldValueButton = connect(({
	children,
	formik: {
		setFieldValue,
		values
	} = {},
	name = '',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	field = path, // Backwards compatibility (should be cleaned up)
	text,
	value,
	onClick = () => {
		//console.debug(toStr({field, value}));
		setFieldValue(field, value)
	},
	...rest
}) => {
	//console.debug(toStr({parentPath, name, path, field, value}));
	return <Button
		onClick={onClick}
		{...rest}
	><Icon className='green plus'/>{children||text}</Button>;
});
