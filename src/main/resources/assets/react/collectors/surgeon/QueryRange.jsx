import {SetButton} from '../../buttons/SetButton';

import {NumberInput} from '../../elements/NumberInput';
import {TextInput} from '../../elements/TextInput';

import {Field} from '../../semantic-ui/Field';
import {Fields} from '../../semantic-ui/Fields';
import {Header} from '../../semantic-ui/Header';
import {Icon} from '../../semantic-ui/Icon';


export const QueryRange = ({
	path,
	queryRange
}) => queryRange
	? <>
		<Header dividing>Query range</Header>
		<Fields>
			<TextInput label="Name" name={`${path}.name`}/>
			<NumberInput label="Min" name={`${path}.min`}/>
			<NumberInput label="Max" name={`${path}.max`}/>
		</Fields>
		<Field>
			<SetButton field={path} value={null}><Icon className='red minus'/> Remove query range</SetButton>
		</Field>
	</>
	: <Field>
		<SetButton field={path} value={{name: '', min: 0, max: 1}}><Icon className='green plus'/> Add query range</SetButton>
	</Field>;
