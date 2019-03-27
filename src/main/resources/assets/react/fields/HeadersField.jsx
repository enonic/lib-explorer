import {FieldArray} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetButton} from '../buttons/SetButton';

import {TextInput} from '../elements/TextInput';
import {Table} from '../elements/Table';

import {Buttons} from '../semantic-ui/Buttons';
import {Field} from '../semantic-ui/Field';
import {Header} from '../semantic-ui/Header';
import {Icon} from '../semantic-ui/Icon';


export const HeadersField = ({
	headers,
	path
}) => headers && headers.length
	? <>
		<Header dividing>Headers</Header>
		<Table headers={['Name', 'Value', 'Action(s)']}>
			<FieldArray
				name={path}
				render={() => headers.map(({name, value}, index) => <tr key={`${path}[${index}]`}>
					<td><TextInput path={`${path}[${index}].name`}/></td>
					<td><TextInput path={`${path}[${index}].value`}/></td>
					<td>
						<Buttons icon>
							<InsertButton index={index} path={path} value={{name: '', value: ''}}/>
							<RemoveButton index={index} path={path}/>
							<MoveDownButton disabled={index === headers.length-1} index={index} path={path} visible={headers.length > 1}/>
							<MoveUpButton index={index} path={path} visible={headers.length > 1}/>
						</Buttons>
					</td>
				</tr>)}
			/>
		</Table>
	</>
	: <Field>
		<SetButton className='block' field={path} value={[{name: '', value: ''}]}><Icon className='green plus'/> Add header(s)</SetButton>
	</Field>
