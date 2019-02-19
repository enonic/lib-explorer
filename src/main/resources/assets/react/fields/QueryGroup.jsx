import {FieldArray} from 'formik';
import {get} from 'lodash';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Fieldset} from '../elements/Fieldset';
import {Radio} from '../elements/Radio';
import {Table} from '../elements/Table';

import {OperatorSelector} from './OperatorSelector';

import {toStr} from '../utils/toStr';


export const QueryGroup = ({
	defaultExpression = {
		type: 'fulltext'
	},
	defaultValue = {
		expressions: [defaultExpression],
		operator: 'or'
	},
	fields,
	name = 'group',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	values,
	value = values ? get(values, path, defaultValue) : defaultValue
}) => {
	console.debug(toStr({
		//defaultValue,
		//fields,
		parentPath, path,
		//values,
		value
	}));
	return <Fieldset legend="Query group">
		<Fieldset legend="Expressions">
			<Table headers={['Type', 'Action']}>
				<FieldArray
					name={`${path}.expressions`}
					render={({insert, swap, remove}) => value.expressions.map(({type}, index) => {
						const key = `${path}.expressions[${index}]`;
						const radioName = `${key}.type`;
						return <tr key={key}>
							<td>
								<Radio
									label="Group"
									name={radioName}
									value="group"
								/>
								<Radio
									label="Fulltext"
									name={radioName}
									value="fulltext"
								/>
								<Radio
									label="Ngram"
									name={radioName}
									value="ngram"
								/>
							</td>
							<td>
								<InsertButton index={index} insert={insert} value={defaultExpression}/>
								<RemoveButton index={index} remove={remove} visible={value.length > 1}/>
								<MoveDownButton disabled={index === value.length-1} index={index} swap={swap} visible={value.length > 1}/>
								<MoveUpButton index={index} swap={swap} visible={value.length > 1}/>
							</td>
						</tr>;
					})}
				/>
			</Table>
			<OperatorSelector
				parentPath={path}
				setFieldValue={setFieldValue}
				values={values}
			/>
		</Fieldset>
	</Fieldset>
} // QueryGroup
