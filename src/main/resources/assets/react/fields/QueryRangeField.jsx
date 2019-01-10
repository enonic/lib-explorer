import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';


export const QueryRangeField = ({queryRange, setFieldValue}) => queryRange
	? (<Fieldset legend="Query range">
		<LabeledField label="Name" name="queryRange.name"/>
		<LabeledField label="Min" name="queryRange.min" type="number"/>
		<LabeledField label="Max" name="queryRange.max" type="number"/>
		<SetFieldValueButton field='queryRange' value={null} setFieldValue={setFieldValue} text="Remove query range"/>
	</Fieldset>)
	: <SetFieldValueButton className='block' field='queryRange' value={{name: '', min: 0, max: 1}} setFieldValue={setFieldValue} text="Add query range"/>;
