import {connect, getIn} from 'formik';

import {SetButton} from '../buttons/SetButton';

import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';
import {Checkbox} from '../elements/Checkbox';

import {isSet} from '../utils/isSet';
//import {toStr} from '../utils/toStr';


export const Pagination = connect(({
	formik: {
		values
	},
	legend = null,
	name = 'pagination',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	value = values && getIn(values, path) || false
}) => {
	if (!value) {
		return <SetButton
			className='block'
			field={path}
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
		<SetButton
			className='block'
			field={path}
			text="Remove pagination"
			value={false}/>
	</>;
	return isSet(legend) ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
}); // pagination
