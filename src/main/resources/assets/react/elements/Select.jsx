import {connect, Field, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';

import {Label} from './Label';

import {isSet} from '../utils/isSet';
import {isString} from '../utils/isString';
//import {toStr} from '../utils/toStr';


function buildSize({
	multiple,
	optgroupsArr,
	optionsArr,
	placeholder
}) {
	if (!multiple) { return 1; }
	let size = 0;
	optgroupsArr.forEach(({options=[]}) => { size += options.length});
	size += optionsArr.length
	if (placeholder) {
		size += 1;
	}
	return size;
}

// label value options
function objToArr(obj) {
	if (Array.isArray(obj)) { // Array of objects
		obj.forEach(({options}, index) => {
			if (options) {
				obj[index].options = objToArr(options) // Recurse
			}
		});
		return obj;
	}

	// Assume obj
	const arr = [];
	Object.entries(obj).forEach(([k, v]) => {
		const rObj = {
			value: k
		};
		if (isString(v)) {
			rObj.label = v;
		} else { // Assume obj
			rObj.label = v.label;
			if (v.options) {
				rObj.options = objToArr(v.options); // Recurse
			}
		}
		arr.push(rObj);
	});
	return arr;
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
	optgroupsArr = objToArr(optgroups),
	options = [],
	optionsArr = objToArr(options),
	placeholder = null,
	defaultValue = placeholder
		? ''
		: (
			isSet(getIn(optgroupsArr, '[0].options[0].value'))
			|| getIn(optionsArr, '[0].value', '')
		),
	size = buildSize({
		multiple,
		optgroupsArr,
		optionsArr,
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
	...rest
}) => {
	/*console.debug(toStr({
		component: 'Select',
		//label,
		//multiple,
		//parentPath,
		//name,
		path,
		//optgroups,
		optgroupsArr,
		options,
		optionsArr,
		//placeholder,
		value,
		//values,
		rest
	}));*/
	const select = <Field
		className='ui dropdown'
		component="select"
		multiple={multiple}
		name={path}
		onChange={onChange}
		size={size}
		value={value}
		{...rest}
	>
		{placeholder ? <option disabled={true} value="">{placeholder}</option> : null}
		{optgroupsArr.map(({
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
		{optionsArr.map(({
			disabled = false,
			label: optionLabel,
			value: optionValue = null
		}) => <option
			key={generateUuidv4()}
			disabled={disabled}
			key={optionValue}
			value={optionValue}
		>{optionLabel || optionValue}</option>)}
	</Field>;
	if(!label) { return select; }
	return <Label label={label}>
		{select}
	</Label>;
});
