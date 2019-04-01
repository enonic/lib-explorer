import {isSet} from '../../utils/isSet';
import {LabeledField} from '../../elements/LabeledField';

export const Delay = ({path, value}) =>
	<LabeledField label="Delay" name={path} value={isSet(value) ? value : 1000}/>
