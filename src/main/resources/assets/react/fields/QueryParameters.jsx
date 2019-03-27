import {FieldArray} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetButton} from '../buttons/SetButton';

import {Table} from '../elements/Table';
import {TextInput} from '../elements/TextInput';

import {Buttons} from '../semantic-ui/Buttons';
import {Field} from '../semantic-ui/Field';
import {Header} from '../semantic-ui/Header';
import {Icon} from '../semantic-ui/Icon';


import {toStr} from '../utils/toStr';


export const QueryParameters = ({
	parentPath,
	value // queryParams
}) => {
	//console.log(toStr({parentPath, value}));

	const path = `${parentPath}.queryParams`;
	//console.log(toStr({path}));

	if (!value || !value.length) {
		return <Field>
			<SetButton field={path} value={[{name: '', value: ''}]}><Icon className='green plus'/> Add query parameter(s)</SetButton>
		</Field>
	}
	return <>
		<Header dividing>Query parameter(s)</Header>
		<Table headers={['Name', 'Value', 'Action(s)']}>
			<FieldArray
				name={path}
				render={() => value.map(({name, value}, index) => <tr key={`${path}[${index}]`}>
					<td><TextInput path={`${path}[${index}].name`}/></td>
					<td><TextInput path={`${path}[${index}].value`}/></td>
					<td>
						<Buttons icon>
							<InsertButton index={index} path={path} value={{name: '', value: ''}}/>
							<RemoveButton index={index} path={path}/>
							<MoveDownButton disabled={index === value.length-1} index={index} path={path} visible={value.length > 1}/>
							<MoveUpButton index={index} path={path} visible={value.length > 1}/>
						</Buttons>
					</td>
				</tr>)}
			/>
		</Table>
	</>
};
