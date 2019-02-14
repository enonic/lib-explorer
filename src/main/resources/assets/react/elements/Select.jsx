import {Field} from 'formik';
import {Label} from './Label';

export const Select = ({
	component,
	label,
	name,
	options,
	placeholder = null,
	setFieldValue,
	...rest // multiple, size, value
}) => {
	/*console.log(JSON.stringify({
		label,
		name,
		options,
		placeholder,
		value,
		rest
	}, null, 4));*/
	const select = <Field
		component="select"
		name={name}
		onChange={({
			target: {
				selectedOptions
			}
		}) => setFieldValue(
			name,
			[].slice
				.call(selectedOptions)
				.map(({value}) => value)
		)}
		{...rest}
	>
		{placeholder ? <option value="">{placeholder}</option> : null}
		{options.map(({label: optionLabel, value: optionValue = null}) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
	</Field>;
	if(!label) { return select; }
	return <Label label={label}>
		{select}
	</Label>;
}
