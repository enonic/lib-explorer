import {connect, FieldArray, getIn} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Table} from '../elements/Table';
import {TextInput} from '../elements/TextInput';


export const UrlsField = connect(({
	formik: {
		values
	},
	parentPath,
	name = 'urls',
	path = `${parentPath}.${name}`,
	value = getIn(values, path) || ['']
}) => {
	/*console.log(JSON.stringify({
		parentPath,
		value
	}, null, 4));*/

	return <Table id='uris' headers={['Uri(s)', 'Action(s)']}>
		<FieldArray
			name={path}
			render={() => value.map((anUrl, index) => {
				const key = `${path}[${index}]`;
				return <tr key={key}>
					<td><TextInput path={key}/></td>
					<td>
						<InsertButton index={index} path={path} value={''}/>
						<RemoveButton index={index} path={path} visible={value.length > 1}/>
						<MoveDownButton disabled={index === value.length-1} index={index} path={path} visible={value.length > 1}/>
						<MoveUpButton index={index} path={path} visible={value.length > 1}/>
					</td>
				</tr>
			})}
		/>
	</Table>
});
