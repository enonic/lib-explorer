import {connect, Field, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';

import {Label} from './Label';

import {isSet} from '../utils/isSet';
//import {toStr} from '../utils/toStr';


function buildSize({
	multiple,
	optgroups,
	options,
	placeholder
}) {
	if (!multiple) { return 1; }
	let size = 0;
	optgroups.forEach(({options=[]}) => { size += options.length});
	size += options.length
	if (placeholder) {
		size += 1;
	}
	return size;
}


export const Select = connect(({
	component, // So it doesn't end up in rest
	formik: {
		setFieldValue,
		values
	},
	label,
	multiple = false,
	parentPath,
	name,
	path = parentPath ? `${parentPath}.${name}` : name,
	optgroups = [],
	options = [],
	placeholder = null,
	defaultValue = placeholder
		? ''
		: (
			isSet(getIn(optgroups, '[0].options[0].value'))
			|| getIn(options, '[0].value', '')
		),
	size = buildSize({
		multiple,
		optgroups,
		options,
		placeholder
	}),
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
		setFieldValue(path, newValue);
	},
	...rest // size
}) => {
	/*console.debug({
		component: 'Select',
		label,
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
		{placeholder ? <option disabled={true} value="">{placeholder}</option> : null}
		{optgroups.map(({
			label: optgroupLabel,
			options: optgroupOptions
		}) => <optgroup key={generateUuidv4()} label={optgroupLabel}>{optgroupOptions.map(({
			disabled = false,
			label: optionLabel,
			value: optionValue = null
		}) => <option
			key={generateUuidv4()}
			disabled={disabled}
			key={optionValue}
			value={optionValue}
		>{optionLabel}</option>)}</optgroup>)}
		{options.map(({
			disabled = false,
			label: optionLabel,
			value: optionValue = null
		}) => <option
			key={generateUuidv4()}
			disabled={disabled}
			key={optionValue}
			value={optionValue}
		>{optionLabel}</option>)}
	</Field>;
	if(!label) { return select; }
	return <Label label={label}>
		{select}
	</Label>;
});
