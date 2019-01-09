import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';


export const PathRangeField = ({pathRange, setFieldValue}) => pathRange
	? (<Fieldset legend="Path range">
		<LabeledField label="Min" name="pathRange.min"/>
		<LabeledField label="Max" name="pathRange.max"/>
		<SetFieldValueButton field='pathRange' value={null} setFieldValue={setFieldValue} text="Remove path range"/>
		</Fieldset>)
	: <SetFieldValueButton field='pathRange' value={{min: 0, max: 1}} setFieldValue={setFieldValue} text="Add path range"/>;
