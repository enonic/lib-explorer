import {Field, FieldArray, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Checkbox} from '../elements/Checkbox';
import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';
import {Table} from '../elements/Table';

import {FieldSelector} from './FieldSelector';


export const ResultMappings = ({
	fields,
	legend = null,
	name = 'resultMappings',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	values,
	value = values && getIn(values, path) || [{
		field: '',
		highlight: false,
		lengthLimit: '',
		to: ''
	}]
}) => {
	const fragment = <>
		<Table headers={['Field', 'To', 'Options', 'Action(s)']}>
			<FieldArray
				name={path}
				render={({insert, swap, remove}) => value
					.map(({
						field = '',
						highlight = false,
						lengthLimit = '',
						to = '',
						uuid4
					}, index) => {
						const pathWithIndex = `${path}[${index}]`;
						return <tr key={uuid4}>
							<td><FieldSelector
								fields={fields}
								parentPath={pathWithIndex}
								setFieldValue={setFieldValue}
								values={values}
							/></td>
							<td><Field
								name={`${pathWithIndex}.to`}
								value={to}
							/></td>
							<td>
								<Checkbox
									checked={highlight}
									label="Highlight?"
									name={`${pathWithIndex}.highlight`}
								/>
								<LabeledField
									label="Limit length to"
									name={`${pathWithIndex}.lengthLimit`}
									type="number"
									value={lengthLimit}
								/>
							</td>
							<td>
								<InsertButton index={index} insert={insert} value={{
									field: '',
									highlight: false,
									lengthLimit: '',
									to: '',
									uuid4: generateUuidv4() // Might not be needed
								}}/>
								<RemoveButton index={index} remove={remove} visible={value.length > 1}/>
								<MoveDownButton disabled={index === value.length-1} index={index} swap={swap} visible={value.length > 1}/>
								<MoveUpButton index={index} swap={swap} visible={value.length > 1}/>
							</td>
						</tr>;
					})}
			/>
		</Table>
	</>;
	return legend ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
} // ResultMappings
