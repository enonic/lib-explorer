import {Field} from 'formik';

import {Label} from '../elements/Label';


export const Radio = ({checked, label, type, value = checked, ...rest}) => {
	//console.log(JSON.stringify({checked, label, rest, type, value}, null, 4));
	const radio = <Field checked={checked} type="radio" value={value} {...rest}/>;
	if(!label) { return radio; }
	return <Label label={label}>{radio}</Label>
};
