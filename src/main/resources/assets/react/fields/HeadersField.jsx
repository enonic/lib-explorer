import {Field, FieldArray} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {Table} from '../elements/Table';


export const HeadersField = ({headers, setFieldValue}) => headers && headers.length
	? (<Fieldset legend="Headers">
		<FieldArray
			name="headers"
			render={({insert, swap, remove}) => (
				<Table headers={['Name', 'Value', 'Action(s)']}>
					{headers && headers.length > 0 && headers.map(({name, value}, index) => {
						console.log(JSON.stringify({
							index,
							name,
							value
						}, null, 4));
						return (<tr key={`headers[${index}]`}>
							{/*<button type="button" onClick={() => insert(index, {name: '', value: ''})}>+</button>*/}
							<td><Field name={`headers[${index}].name`}/></td>
							<td><Field name={`headers[${index}].value`}/></td>
							<td>
								<RemoveButton index={index} remove={remove}/>
								{index ? <MoveUpButton index={index} swap={swap}/> : null}
								{index < headers.length-1 ? <MoveDownButton index={index} swap={swap}/> : null}
								<InsertButton index={index} insert={insert} value={{name: '', value: ''}}/>
							</td>
						</tr>);
					})}
				</Table>
			)}
		/>
	</Fieldset>)
	: <SetFieldValueButton classes='block' field='headers' value={[{name: '', value: ''}]} setFieldValue={setFieldValue} text="Add header(s)"/>
