import {connect, getIn} from 'formik';

import {Checkbox} from '../elements/Checkbox';
import {TextInput} from '../elements/TextInput';
import {FieldSelector} from '../fields/FieldSelector';


export const Range = connect(({
	fields,
	formik: {
		values
	},
	name = 'range',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	value = getIn(values, path)
}) => {
	return <>
		<FieldSelector
			parentPath={path}
			fields={fields}
		/>
		<TextInput
			name='from'
			placeholder='from'
			parentPath={path}
		/>
		<TextInput
			name='to'
			placeholder='to'
			parentPath={path}
		/>
		<Checkbox
			label='Include from?'
			name='includeFrom'
			parentPath={path}
		/>
		<Checkbox
			label='Include to?'
			name='includeTo'
			parentPath={path}
		/>
	</>;
}); // CompareExpression
