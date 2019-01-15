import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';


export const PathRangeField = ({
	path,
	pathRange,
	setFieldValue
}) => pathRange
	? (<Fieldset legend="Path range">
		<LabeledField label="Min" name={`${path}.min`} type="number"/>
		<LabeledField label="Max" name={`${path}.max`} type="number"/>
		<SetFieldValueButton field={path} value={null} setFieldValue={setFieldValue} text="Remove path range"/>
		</Fieldset>)
	: <SetFieldValueButton className='block' field={path} value={{min: 0, max: 1}} setFieldValue={setFieldValue} text="Add path range"/>;
