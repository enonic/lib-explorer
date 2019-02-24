import {Field, getIn} from 'formik';

import {Label} from './Label';

import {toStr} from '../utils/toStr';


export const Select = ({
	component, // So it doesn't end up in rest
	label,
	multiple = false,
	parentPath,
	name,
	path = parentPath ? `${parentPath}.${name}` : name,
	options,
	placeholder = null,
	defaultValue = placeholder ? '' : options[0].value,
	setFieldValue,
	values,
	value = values ? getIn(values, path, defaultValue) : defaultValue,
	onChange = ({
		target: {
			selectedOptions // HTMLCollection
		}
	}) => {
		const htmlCollectionAsArray = [].slice
			.call(selectedOptions)
			.map(({value}) => value);
		const newValue = multiple ? htmlCollectionAsArray : htmlCollectionAsArray[0];
		//console.debug({multiple, path, htmlCollectionAsArray, newValue});
		setFieldValue(path, newValue)
	},
	...rest // size
}) => {
	/*console.debug({
		//label,
		multiple,
		//parentPath,
		//name,
		path,
		//options,
		//placeholder,
		value,
		//values,
		rest
	});*/
	const select = <Field
		component="select"
		multiple={multiple}
		name={path}
		onChange={onChange}
		value={value}
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
