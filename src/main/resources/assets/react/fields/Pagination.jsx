import {getIn} from 'formik';

import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';
import {Checkbox} from '../elements/Checkbox';

import {isSet} from '../utils/isSet';
//import {toStr} from '../utils/toStr';


export const Pagination = ({
	legend = null,
	name = 'pagination',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	values,
	value = values && getIn(values, path) || false
}) => {
	if (!value) {
		return <SetFieldValueButton
			className='block'
			field={path}
			setFieldValue={setFieldValue}
			text="Add pagination"
			value={{
				pagesToShow: 10,
				first: true,
				prev: true,
				next: true,
				last: true
			}}/>;
	}
	const {first, prev, next, last} = value;
	const fragment = <>
		<LabeledField label="Pages to show" name={`${path}.pagesToShow`} value={value.pagesToShow || 10}/>
		<Checkbox checked={first} label="Provide first" name={`${path}.first`}/>
		<Checkbox checked={prev} label="Provide previous" name={`${path}.prev`}/>
		<Checkbox checked={next} label="Provide next" name={`${path}.next`}/>
		<Checkbox checked={last} label="Provide last" name={`${path}.last`}/>
		<SetFieldValueButton
			className='block'
			field={path}
			setFieldValue={setFieldValue}
			text="Remove pagination"
			value={false}/>
	</>;
	return isSet(legend) ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
} // pagination
