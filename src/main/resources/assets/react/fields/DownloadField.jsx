import {Field, FieldArray} from 'formik';
//import {get} from 'lodash';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {Select} from '../elements/Select';
import {Table} from '../elements/Table';


export const DownloadField = ({
	parentPath,
	setFieldValue,
	tags = [],
	value = []/*,
	values*/
}) => {
	const path = `${parentPath}.download`;
	//console.log(JSON.stringify({parentPath, path/*, tags*/, value, values}, null, 4));
	if(!value || !Array.isArray(value)) {
		value = [];
	}
	if(!value.length) {
		return <SetFieldValueButton className='block' field={path} value={[{expr: '', tags: []}]} setFieldValue={setFieldValue} text="Add download expression(s)"/>
	}

	return <Fieldset legend="Download">
		<Table headers={['Expression', 'Tag(s)', 'Action(s)']}>
			<FieldArray
				name={path}
				render={({insert, swap, remove}) => value.map(({expr, tags: selectedTags}, index) => {
					//console.log(JSON.stringify({expr, selectedTags, index}, null, 4));

					const key = `${path}[${index}]`;
					//console.log(JSON.stringify({key}, null, 4));

					//const selectedTags = get(values, tagsPath, []);
					//console.log(JSON.stringify({selectedTags}, null, 4));

					return <tr key={key}>
						<td><Field autoComplete="off" name={`${key}.expr`} value={expr}/></td>
						<td><Select
							multiple={true}
							name={`${key}.tags`}
							options={tags}
							setFieldValue={setFieldValue}
							value={selectedTags}
						/></td>
						<td>
							<InsertButton index={index} insert={insert} value={''}/>
							<RemoveButton index={index} remove={remove}/>
							<MoveDownButton disabled={index === value.length-1} index={index} swap={swap} visible={value.length > 1}/>
							<MoveUpButton index={index} swap={swap} visible={value.length > 1}/>
						</td>
					</tr>;
				})}
			/>
		</Table>
	</Fieldset>;
}
