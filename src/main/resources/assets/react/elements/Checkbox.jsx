import {Field} from 'formik';

import {Label} from '../elements/Label';


export const Checkbox = ({checked, label, type, value = checked, ...rest}) => {
	//console.log(JSON.stringify({checked, label, rest, type, value}, null, 4));
	const checkbox = <Field checked={checked} type="checkbox" value={value} {...rest}/>;
	if(!label) { return checkbox; }
	return <Label label={label}>{checkbox}</Label>
};
