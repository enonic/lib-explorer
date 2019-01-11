import {Label} from './Label';

export const Select = ({
	handleBlur,
	handleChange,
	label,
	name,
	options,
	placeholder,
	value,
	...rest
}) => {
	/*console.log(JSON.stringify({
		label,
		name,
		options,
		placeholder,
		value,
		rest
	}, null, 4));*/
	const select = <select name={name} onBlur={handleBlur} onChange={handleChange} value={value} {...rest}>
		{placeholder ? <option value="">{placeholder}</option> : null}
		{options.map(({label: optionLabel, value: optionValue = null}) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
	</select>;
	if(!label) { return select; }
	return <Label label={label}>
		{select}
	</Label>;
}
/*
selected={optionValue === value ? 'selected' : null}
*/
