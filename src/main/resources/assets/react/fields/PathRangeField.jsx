import {SetButton} from '../buttons/SetButton';

import {Fieldset} from '../elements/Fieldset';
import {NumberInput} from '../elements/NumberInput';

import {Field} from '../semantic-ui/Field';
import {Fields} from '../semantic-ui/Fields';
import {Header} from '../semantic-ui/Header';
import {Icon} from '../semantic-ui/Icon';



export const PathRangeField = ({
	path,
	pathRange
}) => pathRange
	? <>
		<Header dividing>Path range</Header>
		<Fields>
			<NumberInput label="Min" path={`${path}.min`}/>
			<NumberInput label="Max" path={`${path}.max`}/>
		</Fields>
		<Field>
			<SetButton field={path} value={null}><Icon className='red minus'/> Remove path range</SetButton>
		</Field>
	</>
	: <Field>
		<SetButton field={path} value={{min: 0, max: 1}}><Icon className='green plus'/> Add path range</SetButton>
	</Field>;
