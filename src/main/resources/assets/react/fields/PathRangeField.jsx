import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';


export const PathRangeField = ({
	path,
	pathRange
}) => pathRange
	? (<Fieldset legend="Path range">
		<LabeledField label="Min" name={`${path}.min`} type="number"/>
		<LabeledField label="Max" name={`${path}.max`} type="number"/>
		<SetFieldValueButton field={path} value={null} text="Remove path range"/>
	</Fieldset>)
	: <SetFieldValueButton className='block' field={path} value={{min: 0, max: 1}} text="Add path range"/>;
