import {Field, FieldArray, getIn} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {Select} from '../elements/Select';
import {Table} from '../elements/Table';

import {FieldSelector} from './FieldSelector';
import {ScrapeExpressionBuilder} from './ScrapeExpressionBuilder';
import {TagSelector} from './TagSelector';


export const ScrapeField = ({
	fields = [],
	name = 'scrape',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	tags = [],
	values,
	value = getIn(values, path) || undefined
}) => {
	//console.log(JSON.stringify({/*parentPath, value, */values}, null, 4));

	const tagsPath = `${parentPath}.tags`;
	//console.log(JSON.stringify({tagsPath}, null, 4));

	const tagsArray = getIn(values, tagsPath) || [{field: '', tags: []}];

	if(!(value && Array.isArray(value) && value.length)) {
		return <SetFieldValueButton className='block' field={path} value={[{field: '', dataExpr: ''}]} setFieldValue={setFieldValue} text="Add scrape field"/>
	}
	return <Fieldset legend="Field(s)">
		<Table headers={['Field', 'Type', 'Options', 'Actions']}>
			<FieldArray
				name={path}
				render={({insert, swap, remove}) => value.map(({
					field,
					option = 'scrape',
					dataExpr,
					tags: selectedTags = []
				}, index) => <tr key={`${path}[${index}]`}>
					<td>
						<FieldSelector
							name={`${path}[${index}].field`}
							fields={fields}
							setFieldValue={setFieldValue}
							value={field}
						/>
					</td>
					<td>
						<Select
							path={`${path}[${index}].option`}
							options={[{
								label: 'Scrape',
								value: 'scrape'
							}, {
								label: 'Tag',
								value: 'tag'
							}]}
							setFieldValue={setFieldValue}
							value={option}
						/>
					</td>
					<td>
						{option === 'scrape'
							? <>
								{dataExpr ? <Field
									autoComplete="off"
									label="Data extraction expression"
									name={`${path}[${index}].dataExpr`}
								/> : null}
								<ScrapeExpressionBuilder
									parentPath={`${path}[${index}]`}
									setFieldValue={setFieldValue}
									values={values}
								/>
							</>
							: field
								? <TagSelector
									label=""
									multiple={true}
									path={`${path}[${index}].tags`}
									tags={tags[field]}
									setFieldValue={setFieldValue}
									value={selectedTags}
								/>
								: null
						}
					</td>
					<td>
						<InsertButton index={index} insert={insert} value={{field: '', dataExpr: ''}}/>
						<RemoveButton index={index} remove={remove}/>
						<MoveDownButton disabled={index === value.length-1} index={index} swap={swap} visible={value.length > 1}/>
						<MoveUpButton index={index} swap={swap} visible={value.length > 1}/>
					</td>
				</tr>)}
			/>
		</Table>
	</Fieldset>;
};
