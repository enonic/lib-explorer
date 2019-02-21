import {Field, FieldArray, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Fieldset} from '../elements/Fieldset';
import {Radio} from '../elements/Radio';
import {Select} from '../elements/Select';
import {Table} from '../elements/Table';

import {OperatorSelector} from '../fields/OperatorSelector';


//import {toStr} from '../utils/toStr';


export const Fulltext = ({
	fields,
	name = 'fulltext',
	legend = null,
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	values,
	value = values && getIn(values, path) || {
		fields: [{
			field: '',
			boost: ''
		}],
		operator: 'or'
	}
}) => {
	/*console.debug(toStr({
		//fields,
		//name,
		//parentPath,
		//path,
		//values,
		//value,
	}));*/
	const fragment = <>
		<OperatorSelector parentPath={path} setFieldValue={setFieldValue} values={values}/>
		<Table headers={['Field', 'Boost', `Action${value.fields.length > 1 ? 's' : ''}`]}>
			<FieldArray
				name={`${path}.fields`}
				render={({insert, swap, remove}) => value.fields
					.map(({field = '', boost = '', uuid4}, index) => {
						// https://reactjs.org/docs/lists-and-keys.html#keys-must-only-be-unique-among-siblings
						// https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318
						const pathWithIndex = `${path}.fields[${index}]`;
						const boostPath = `${pathWithIndex}.boost`;
						const fieldPath = `${pathWithIndex}.field`;
						const fieldValue = getIn(values, fieldPath, '');
						const boostValue = getIn(values, boostPath, '');
						//console.debug(toStr({uuid4, index, fieldPath, field, fieldValue, boostPath, boost, boostValue}));
						return <tr key={uuid4}>
							<td><Select
								path={fieldPath}
								options={fields}
								placeholder='Select field'
								setFieldValue={setFieldValue}
								values={values}
							/></td>
							<td><Field autoComplete="off" name={boostPath} value={boost}/></td>
							<td>
								<InsertButton
									index={index}
									insert={insert}
									value={{
										field: '',
										boost: '',
										uuid4: generateUuidv4()
									}}
								/>
								<RemoveButton index={index} remove={remove} visible={value.fields.length > 1}/>
								<MoveDownButton disabled={index === value.fields.length-1} index={index} swap={swap} visible={value.fields.length > 1}/>
								<MoveUpButton index={index} swap={swap} visible={value.fields.length > 1}/>
							</td>
						</tr>
					})}
			/>
		</Table>
	</>;
	return legend ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
}
