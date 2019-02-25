import {getIn} from 'formik';

import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';
import {Checkbox} from '../elements/Checkbox';

import {PhraseSelector} from './PhraseSelector';

import {isSet} from '../utils/isSet';
//import {toStr} from '../utils/toStr';


export const Pagination = ({
	legend = null,
	name = 'pagination',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	phrases,
	setFieldValue,
	values,
	value = values && getIn(values, path) || false
}) => {
	if (!value) {
		return <SetFieldValueButton
			className='block'
			field={path}
			setFieldValue={setFieldValue}
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
		{first ? <PhraseSelector
			path={`${path}.firstPhrase`}
			phrases={phrases}
			placeholder="Please select phrase"
			setFieldValue={setFieldValue}
			values={values}
		/> : null}

		<Checkbox checked={prev} label="Provide previous" name={`${path}.prev`}/>
		{prev ? <PhraseSelector
			path={`${path}.prevPhrase`}
			phrases={phrases}
			placeholder="Please select phrase"
			setFieldValue={setFieldValue}
			values={values}
		/> : null}

		<Checkbox checked={next} label="Provide next" name={`${path}.next`}/>
		{next ? <PhraseSelector
			path={`${path}.nextPhrase`}
			phrases={phrases}
			placeholder="Please select phrase"
			setFieldValue={setFieldValue}
			values={values}
		/> : null}

		<Checkbox checked={last} label="Provide last" name={`${path}.last`}/>
		{last ? <PhraseSelector
			path={`${path}.lastPhrase`}
			phrases={phrases}
			placeholder="Please select phrase"
			setFieldValue={setFieldValue}
			values={values}
		/> : null}

		<SetFieldValueButton
			className='block'
			field={path}
			setFieldValue={setFieldValue}
			text="Remove pagination"
			value={false}/>
	</>;
	return isSet(legend) ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
} // pagination
