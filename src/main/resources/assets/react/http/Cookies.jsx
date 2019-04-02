import {connect, FieldArray, getIn} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetButton} from '../buttons/SetButton';

import {TextInput} from '../formik/TextInput';

import {Buttons} from '../semantic-ui/Buttons';
import {Field} from '../semantic-ui/Field';
import {Header} from '../semantic-ui/Header';
import {Icon} from '../semantic-ui/Icon';

import {Table} from '../semantic-ui/Table';
import {Th} from '../semantic-ui/Th';
import {Td} from '../semantic-ui/Td';

//import {toStr} from '../utils/toStr';


export const Cookies = connect(({
	formik: {
		values
	},
	name = 'cookies',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	value = getIn(values, path)
}) => {
	/*console.debug(toStr({
		component: 'Cookies',
		parentPath,
		name,
		path,
		value
	}));*/
	if(!(value && Array.isArray(value) && value.length)) {
		return <Field>
			<SetButton
				field={path}
				value={[{
					name: '',
					value: ''
				}]}
			><Icon className='green plus'/> Add Cookie(s)</SetButton>
		</Field>
	}
	return <>
		<Header dividing>Cookies</Header>
		<Table>
			<thead>
				<tr>
					<Th>Name</Th>
					<Th colSpan='2'>Value</Th>
				</tr>
			</thead>
			<tbody>
				<FieldArray
					name={path}
					render={() => value.map(({
						name: cookieName = '',
						value: cookieValue = ''
					}, index) => {
						const key =`${path}[${index}]`;
						return <tr key={key}>
							<Td><TextInput parentPath={key} name='name'/></Td>
							<Td><TextInput parentPath={key} name='value'/></Td>
							<Td>
								<Buttons icon>
									<InsertButton index={index} path={path} value={{name: '', value: ''}}/>
									<RemoveButton index={index} path={path}/>
									<MoveDownButton disabled={index === value.length-1} index={index} path={path} visible={value.length > 1}/>
									<MoveUpButton index={index} path={path} visible={value.length > 1}/>
								</Buttons>
							</Td>
						</tr>
					})}
				/>

			</tbody>
		</Table>
	</>;
}); // Cookies
