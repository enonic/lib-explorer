import {Field, FieldArray} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {Table} from '../elements/Table';


export const HeadersField = ({
	headers,
	path,
	setFieldValue
}) => headers && headers.length
	? <Fieldset legend="Headers">
		<Table headers={['Name', 'Value', 'Action(s)']}>
			<FieldArray
				name={path}
				render={({insert, swap, remove}) => headers.map(({name, value}, index) => <tr key={`${path}[${index}]`}>
					<td><Field autoComplete="off" name={`${path}[${index}].name`}/></td>
					<td><Field autoComplete="off" name={`${path}[${index}].value`}/></td>
					<td>
						<InsertButton index={index} insert={insert} value={{name: '', value: ''}}/>
						<RemoveButton index={index} remove={remove}/>
						<MoveDownButton disabled={index === headers.length-1} index={index} swap={swap} visible={headers.length > 1}/>
						<MoveUpButton index={index} swap={swap} visible={headers.length > 1}/>
					</td>
				</tr>)}
			/>
		</Table>
	</Fieldset>
	: <SetFieldValueButton className='block' field={path} value={[{name: '', value: ''}]} setFieldValue={setFieldValue} text="Add header(s)"/>
