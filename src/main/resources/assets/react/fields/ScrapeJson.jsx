import {connect, FieldArray, getIn} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {Select} from '../elements/Select';
import {Table} from '../elements/Table';

import {FieldSelector} from './FieldSelector';

import {toStr} from '../utils/toStr';


export const ScrapeJson = connect(({
	formik: {
		values
	},
	fieldsObj,
	name = 'scrapeJson',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	value = getIn(values, path)
}) => {
	console.debug(toStr({component: 'ScrapeJson', parentPath, name, path, value}));
	if(!(value && Array.isArray(value) && value.length)) {
		return <SetFieldValueButton
			className='block'
			field={path}
			value={[{field: ''}]}
			text="Scrape JSON"/>
	}
	return <Fieldset legend="Scrape JSON">
		<Table headers={['Field', 'Type', 'Options', 'Actions']}>
			<FieldArray
				name={path}
				render={() => value.map(({
					field,
					option = 'scrape'
				}, index) => <tr key={`${path}[${index}]`}>
					<td>
						<FieldSelector
							name={`${path}[${index}].field`}
							fields={fieldsObj}
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
							value={option}
						/>
					</td>
					<td></td>
					<td>
						<InsertButton index={index} path={path} value={{field: ''}}/>
						<RemoveButton index={index} path={path}/>
						<MoveDownButton disabled={index === value.length-1} index={index} path={path} visible={value.length > 1}/>
						<MoveUpButton index={index} path={path} visible={value.length > 1}/>
					</td>
				</tr>)}
			/>
		</Table>
	</Fieldset>;
});
