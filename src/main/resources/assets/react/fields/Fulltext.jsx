import {connect, FieldArray, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Fieldset} from '../elements/Fieldset';
import {NumberInput} from '../elements/NumberInput';
import {Radio} from '../elements/Radio';
import {Select} from '../elements/Select';
import {Table} from '../elements/Table';

import {OperatorSelector} from '../fields/OperatorSelector';


//import {toStr} from '../utils/toStr';


export const Fulltext = connect(({
	formik: {
		values
	},
	fields,
	name = 'fulltext',
	legend = null,
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
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
		<OperatorSelector parentPath={path}/>
		<Table headers={['Field', 'Boost', `Action${value.fields.length > 1 ? 's' : ''}`]}>
			<FieldArray
				name={`${path}.fields`}
				render={() => value.fields
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
							/></td>
							<td><NumberInput path={boostPath}/></td>
							<td>
								<InsertButton
									index={index}
									path={`${path}.fields`}
									value={{
										field: '',
										boost: '',
										uuid4: generateUuidv4()
									}}
								/>
								<RemoveButton
									index={index}
									path={`${path}.fields`}
									visible={value.fields.length > 1}
								/>
								<MoveDownButton
									disabled={index === value.fields.length-1}
									index={index}
									path={`${path}.fields`}
									visible={value.fields.length > 1}/>
								<MoveUpButton
									index={index}
									path={`${path}.fields`}
									visible={value.fields.length > 1}
								/>
							</td>
						</tr>
					})}
			/>
		</Table>
	</>;
	return legend ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
});
