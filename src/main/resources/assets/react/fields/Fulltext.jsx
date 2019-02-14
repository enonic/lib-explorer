import {Field, FieldArray} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Fieldset} from '../elements/Fieldset';
import {Radio} from '../elements/Radio';
import {Select} from '../elements/Select';
import {Table} from '../elements/Table';

import {toStr} from '../utils/toStr';


export const Fulltext = ({
	fields,
	path,
	setFieldValue,
	value = {
		fields: [{
			field: '',
			boost: ''
		}],
		operator: 'or'
	}

}) => {
	console.log(toStr({value}));
	//const path = `${parentPath}.fulltext`;
	return <Fieldset legend="Fulltext">
		<Table headers={['Field', 'Boost']}>
			<FieldArray
				name={path}
				render={({insert, swap, remove}) => value.fields.map(({field, boost}, index) => {
					const key = `${path}.fields[${index}]`;
					return <tr key={key}>
						<td><Select
							name={`${key}.field`}
							options={fields}
							setFieldValue={setFieldValue}
							value={field}
						/></td>
						<td><Field autoComplete="off" name={`${key}.boost`} value={boost}/></td>
						<td>
							<InsertButton index={index} insert={insert} value={{field:'', boost:''}}/>
							<RemoveButton index={index} remove={remove} visible={value.length > 1}/>
							<MoveDownButton disabled={index === value.length-1} index={index} swap={swap} visible={value.length > 1}/>
							<MoveUpButton index={index} swap={swap} visible={value.length > 1}/>
						</td>
					</tr>
				})}
			/>
		</Table>
		<Fieldset legend="Operator">
			<Radio
				checked={value.operator !== 'and'}
				label="OR"
				name={`${path}.operator`}
				value="or"
			/>
			<Radio
				checked={value.operator === 'and'}
				label="AND"
				name={`${path}.operator`}
				value="and"
			/>
		</Fieldset>
	</Fieldset>;
}
