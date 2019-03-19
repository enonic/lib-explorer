import {connect, Field, FieldArray, getIn} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {Table} from '../elements/Table';

import {isSet} from '../utils/isSet';
import {toStr} from '../utils/toStr';
import {ucFirst} from '../utils/ucFirst';

import {FieldSelector} from './FieldSelector';
import {QueryFilterSelector} from './QueryFilterSelector';
import {TagSelector} from './TagSelector';


export const QueryFilterClause = connect(({
	fields = [],
	formik: {
		values
	},
	parentPath,
	name = 'must',
	legend = ucFirst(name),
	path = parentPath ? `${parentPath}.${name}` : name,
	tags,
	value = getIn(values, path)
}) => {
	//console.debug(toStr({component: 'QueryFilterClause', parentPath, name, path, value}));
	return isSet(value)
		? <Fieldset legend={legend}>
			<Table headers={['Filter', 'Field', 'Values']}>
				<FieldArray
					name={path}
					render={() => value.map(({
						filter,
						params: {
							field = '',
							values: fieldValues = []
						}}, index) => {
						const key=`${path}[${index}]`;
						//console.debug(toStr({component: 'QueryFilterClause', filter, field, values, index, key}));
						return <tr key={key}>
							<td>
								<QueryFilterSelector
									parentPath={key}
									value={filter}
								/>
							</td>
							<td>{['exists', 'hasValue', 'notExists'].includes(filter)
								? <FieldSelector
									fields={fields}
									parentPath={`${key}.params`}
								/>
								: null
							}</td>
							<td>{filter === 'hasValue'
								? <TagSelector
									multiple={true}
									path={`${key}.params.values`}
									tags={tags[`/fields/${field}`]}
								/>
								: null
							}{filter === 'ids'
								? <Field
									name={`${key}.params.values`}
									size={Math.max(30, fieldValues.length)}
									value={fieldValues}
								/>
								: null
							}</td>
							<td>
								<InsertButton
									index={index}
									path={path}
									value={{
										filter: 'exists',
										params: {
											field: ''
										}
									}}
								/>
								<RemoveButton
									index={index}
									path={path}
								/>
								<MoveDownButton
									disabled={index === value.length-1}
									index={index}
									path={path}
									visible={value.length > 1}
								/>
								<MoveUpButton
									index={index}
									path={path}
									visible={value.length > 1}
								/>
							</td>
						</tr>;
					})}
				/>
			</Table>
		</Fieldset>
		: <SetFieldValueButton
			className='block'
			path={path}
			text={`Add ${name} filter(s)`}
			value={[{
				filter: 'exists',
				params: {
					field: ''
				}
			}]}
		/>
});
