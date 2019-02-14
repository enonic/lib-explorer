import {LabeledField} from '../elements/LabeledField';

export const NameField = ({
	label = 'Name',
	name = 'name',
	value = ''
}) =>
	<LabeledField autoComplete="off" label={label} name={name} value={value}/>
