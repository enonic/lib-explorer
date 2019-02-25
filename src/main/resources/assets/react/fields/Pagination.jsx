import {FieldArray, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';


import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';
import {Checkbox} from '../elements/Checkbox';

import {isSet} from '../utils/isSet';
import {toStr} from '../utils/toStr';


export const Pagination = ({
	legend = null,
	name = 'pagination',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	values,
	value = values && getIn(values, path) || []
}) => {
	if (!(Array.isArray(value) && value.length)) {
		return <SetFieldValueButton
			className='block'
			field={path}
			setFieldValue={setFieldValue}
			text="Add pagination"
			value={[{
				pagesToShow: 10,
				first: true,
				prev: true,
				next: true,
				last: true,
				uuid4: generateUuidv4()
			}]}
		/>;
	}
	const fragment = <>
		<FieldArray
			name={path}
			render={({remove}) => value
				.map(({
					pagesToShow,
					first,
					prev,
					next,
					last,
					uuid4
				}, index) => {
					//console.debug(toStr({pagesToShow, first, prev, next, last, uuid4}));
					return <div key={uuid4}>
						<LabeledField label="Pages to show" name={'pagesToShow'} value={isSet(pagesToShow) ? pagesToShow : 10}/>
						<Checkbox checked={first} label="Provide first" name={`${name}.first`}/>
						<Checkbox checked={prev} label="Provide previous" name={`${name}.prev`}/>
						<Checkbox checked={next} label="Provide next" name={`${name}.next`}/>
						<Checkbox checked={last} label="Provide last" name={`${name}.first`}/>
						<RemoveButton index={index} remove={remove}/>
					</div>
				})}
		/>
	</>;
	return isSet(legend) ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
} // pagination
