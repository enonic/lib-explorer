import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';


export const QueryRangeField = ({
	path,
	queryRange
}) => queryRange
	? <Fieldset legend="Query range">
		<LabeledField autoComplete="off" label="Name" name={`${path}.name`}/>
		<LabeledField label="Min" name={`${path}.min`} type="number"/>
		<LabeledField label="Max" name={`${path}.max`} type="number"/>
		<SetFieldValueButton field={path} value={null} text="Remove query range"/>
	</Fieldset>
	: <SetFieldValueButton className='block' field={path} value={{name: '', min: 0, max: 1}} text="Add query range"/>;
