import {Field, FieldArray} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {Table} from '../elements/Table';

import {toStr} from '../utils/toStr';


export const QueryParameters = ({
	parentPath,
	value // queryParams
}) => {
	//console.log(toStr({parentPath, value}));

	const path = `${parentPath}.queryParams`;
	//console.log(toStr({path}));

	if (!value || !value.length) {
		return <SetFieldValueButton className='block' field={path} value={[{name: '', value: ''}]} text="Add query parameter(s)"/>
	}
	return <Fieldset legend="Query parameter(s)">
		<Table headers={['Name', 'Value', 'Action(s)']}>
			<FieldArray
				name={path}
				render={() => value.map(({name, value}, index) => <tr key={`${path}[${index}]`}>
					<td><Field autoComplete="off" name={`${path}[${index}].name`}/></td>
					<td><Field autoComplete="off" name={`${path}[${index}].value`}/></td>
					<td>
						<InsertButton index={index} path={path} value={{name: '', value: ''}}/>
						<RemoveButton index={index} path={path}/>
						<MoveDownButton disabled={index === value.length-1} index={index} path={path} visible={value.length > 1}/>
						<MoveUpButton index={index} path={path} visible={value.length > 1}/>
					</td>
				</tr>)}
			/>
		</Table>
	</Fieldset>
};
