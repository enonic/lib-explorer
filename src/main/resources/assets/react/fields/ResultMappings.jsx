import {connect, Field, FieldArray, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Checkbox} from '../elements/Checkbox';
import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';
import {Table} from '../elements/Table';
import {TextInput} from '../elements/TextInput';

import {FieldSelector} from './FieldSelector';
import {ResultMappingTypeSelector} from './ResultMappingTypeSelector';


export const ResultMappings = connect(({
	formik: {
		values
	},
	fields,
	legend = null,
	name = 'resultMappings',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	value = values && getIn(values, path) || [{
		field: '',
		highlight: false,
		lengthLimit: '',
		to: ''
	}]
}) => {
	const fragment = <>
		<Table headers={['Field', 'To', 'Type', 'Options', 'Action(s)']}>
			<FieldArray
				name={path}
				render={() => value
					.map(({
						field = '',
						highlight = false,
						join = true,
						lengthLimit = '',
						separator = ' ',
						to = '',
						uuid4
					}, index) => {
						const pathWithIndex = `${path}[${index}]`;
						const typePath = `${pathWithIndex}.type`;
						const type = getIn(values, typePath, 'string');
						return <tr key={uuid4}>
							<td><FieldSelector
								fields={fields}
								parentPath={pathWithIndex}
							/></td>
							<td><Field
								name={`${pathWithIndex}.to`}
								value={to}
							/></td>
							<td><ResultMappingTypeSelector
								path={typePath}
								value={type}
							/></td>
							<td>
								{type === 'string' ? <>
									<Checkbox
										checked={join}
										label="Join if array?"
										name={`${pathWithIndex}.join`}
									/>
									{join ? <TextInput
										label='Separator'
										path={`${pathWithIndex}.separator`}
										placeholder='separator'
										value={separator}
									/> : null}
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
								</> : null}
							</td>
							<td>
								<InsertButton index={index} path={path} value={{
									field: '',
									highlight: false,
									lengthLimit: '',
									to: '',
									uuid4: generateUuidv4() // Might not be needed
								}}/>
								<RemoveButton index={index} path={path} visible={value.length > 1}/>
								<MoveDownButton disabled={index === value.length-1} index={index} path={path} visible={value.length > 1}/>
								<MoveUpButton index={index} path={path} visible={value.length > 1}/>
							</td>
						</tr>;
					})}
			/>
		</Table>
	</>;
	return legend ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
}); // ResultMappings
