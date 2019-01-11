import {Label} from './Label';


export const Select = ({label, name, options, value, ...rest}) => {
	const select = <select name={name} value={value} {...rest}>
		{options.map(({displayName, key}) => <option key={key} value={key}>{displayName}</option>)}
	</select>;
	if(!label) { return select; }
	return <Label label={label}>
		{select}
	</Label>;
}
