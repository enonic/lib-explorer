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
	path
}) => headers && headers.length
	? <Fieldset legend="Headers">
		<Table headers={['Name', 'Value', 'Action(s)']}>
			<FieldArray
				name={path}
				render={() => headers.map(({name, value}, index) => <tr key={`${path}[${index}]`}>
					<td><Field autoComplete="off" name={`${path}[${index}].name`}/></td>
					<td><Field autoComplete="off" name={`${path}[${index}].value`}/></td>
					<td>
						<InsertButton index={index} path={path} value={{name: '', value: ''}}/>
						<RemoveButton index={index} path={path}/>
						<MoveDownButton disabled={index === headers.length-1} index={index} path={path} visible={headers.length > 1}/>
						<MoveUpButton index={index} path={path} visible={headers.length > 1}/>
					</td>
				</tr>)}
			/>
		</Table>
	</Fieldset>
	: <SetFieldValueButton className='block' field={path} value={[{name: '', value: ''}]} text="Add header(s)"/>
