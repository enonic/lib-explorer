import {Field, FieldArray} from 'formik';
import {get} from 'lodash';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {Select} from '../elements/Select';
import {Table} from '../elements/Table';


export const ScrapeField = ({
	fields = [],
	parentPath,
	setFieldValue,
	tags = [],
	value,
	values
}) => {
	//console.log(JSON.stringify({/*parentPath, value, */values}, null, 4));

	const path = `${parentPath}.scrape`;
	//console.log(JSON.stringify({path}, null, 4));

	const tagsPath = `${parentPath}.tags`;
	//console.log(JSON.stringify({tagsPath}, null, 4));

	const selectedTags = get(values, tagsPath, []);
	//console.log(JSON.stringify({selectedTags}, null, 4));

	if(!(value && Array.isArray(value) && value.length)) {
		return <SetFieldValueButton className='block' field={path} value={[{field: '', dataExpr: ''}]} setFieldValue={setFieldValue} text="Add scrape field"/>
	}
	return <Fieldset legend="Scrape">
		<Table headers={['Field', 'Expression', 'Action(s)']}>
			<FieldArray
				name={path}
				render={({insert, swap, remove}) => value.map(({field, dataExpr}, index) => <tr key={`${path}[${index}]`}>
					<td><Select
						name={`${path}[${index}].field`}
						options={fields}
						placeholder="Please select a field"
						setFieldValue={setFieldValue}
						value={field}
					/></td>
					<td><Field autoComplete="off" label="Data extraction expression" name={`${path}[${index}].dataExpr`}/></td>
					<td>
						<InsertButton index={index} insert={insert} value={{field: '', dataExpr: ''}}/>
						<RemoveButton index={index} remove={remove}/>
						<MoveDownButton disabled={index === value.length-1} index={index} swap={swap} visible={value.length > 1}/>
						<MoveUpButton index={index} swap={swap} visible={value.length > 1}/>
					</td>
				</tr>)}
			/>
		</Table>
		<Select
			label="Tag(s)"
			multiple={true}
			name={tagsPath}
			options={tags}
			setFieldValue={setFieldValue}
			value={selectedTags}
		/>
	</Fieldset>;
};
