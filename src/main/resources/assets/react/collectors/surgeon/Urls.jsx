import {connect, FieldArray, getIn} from 'formik';

import {InsertButton} from '../../buttons/InsertButton';
import {MoveUpButton} from '../../buttons/MoveUpButton';
import {MoveDownButton} from '../../buttons/MoveDownButton';
import {RemoveButton} from '../../buttons/RemoveButton';

import {TextInput} from '../../elements/TextInput';

import {Buttons} from '../../semantic-ui/Buttons';
import {Table} from '../../semantic-ui/Table';


export const Urls = connect(({
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
	return <Table className='single line' id='uris'>
		<thead>
			<tr>
				<th colSpan='2'>Uri(s)</th>
			</tr>
		</thead>
		<tbody>
			<FieldArray
				name={path}
				render={() => value.map((anUrl, index) => {
					const key = `${path}[${index}]`;
					return <tr key={key}>
						<td><TextInput path={key}/></td>
						<td className='collapsing'>
							<Buttons icon>
								<InsertButton index={index} path={path} value={''}/>
								<RemoveButton index={index} path={path} visible={value.length > 1}/>
								<MoveDownButton disabled={index === value.length-1} index={index} path={path} visible={value.length > 1}/>
								<MoveUpButton index={index} path={path} visible={value.length > 1}/>
							</Buttons>
						</td>
					</tr>
				})}
			/>
		</tbody>
	</Table>
});
