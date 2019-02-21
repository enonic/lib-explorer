import {FieldArray, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Fieldset} from '../elements/Fieldset';
import {Radio} from '../elements/Radio';
import {Table} from '../elements/Table';

import {OperatorSelector} from './OperatorSelector';
import {ExpressionSelector} from './ExpressionSelector';

//import {toStr} from '../utils/toStr';


export const QueryGroup = ({
	fields,
	name = 'group',
	legend = null,
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	values,
	value = values && getIn(values, path) || {
		expressions: [{
			type: 'fulltext',
			params: {
				fields: [{
					field: '',
					boost: ''
				}],
				operator: 'or'
			}
		}],
		operator: 'or'
	}
}) => {
	/*console.debug(toStr({
		//fields,
		parentPath, path,
		//values,
		value
	}));*/
	const fragment = <>
		<OperatorSelector
			parentPath={path}
			setFieldValue={setFieldValue}
			values={values}
		/>
		<Fieldset legend={`Expression${value.expressions.length > 1 ? 's' : ''}`}>
			<FieldArray
				name={`${path}.expressions`}
				render={({insert, swap, remove}) => value.expressions.map(({uuid4}, index) => {
					const expressionPath = `${path}.expressions[${index}]`;
					return <div key={uuid4}>
						<ExpressionSelector
							fields={fields}
							path={expressionPath}
							setFieldValue={setFieldValue}
							values={values}
						/>
						<InsertButton
							index={index}
							insert={insert}
							text={`${index === (value.expressions.length - 1) ? 'Add' : 'Insert'} expression`}
							value={{
								type: 'fulltext',
								params: {
									fields: [{
										field: '',
										boost: ''
									}],
									operator: 'or'
								},
								uuid4: generateUuidv4()
							}}
						/>
						<RemoveButton index={index} remove={remove} text="Remove expression" visible={value.expressions.length > 1}/>
						<MoveDownButton disabled={index === value.expressions.length-1} index={index} swap={swap} visible={value.expressions.length > 1}/>
						<MoveUpButton index={index} swap={swap} visible={value.expressions.length > 1}/>
						<br />
					</div>;
				})}
			/>
		</Fieldset>
	</>;
	return legend ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
} // QueryGroup
