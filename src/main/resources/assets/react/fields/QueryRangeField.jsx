import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';


export const QueryRangeField = ({
	path,
	queryRange,
	setFieldValue
}) => queryRange
	? <Fieldset legend={`Query range (${path})`}>
		<LabeledField autoComplete="off" label="Name" name={`${path}.name`}/>
		<LabeledField label="Min" name={`${path}.min`} type="number"/>
		<LabeledField label="Max" name={`${path}.max`} type="number"/>
		<SetFieldValueButton field={path} value={null} setFieldValue={setFieldValue} text="Remove query range"/>
	</Fieldset>
	: <SetFieldValueButton className='block' field={path} value={{name: '', min: 0, max: 1}} setFieldValue={setFieldValue} text="Add query range"/>;
