import {Field, FieldArray} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Fieldset} from '../elements/Fieldset';
import {Label} from '../elements/Label';
import {Table} from '../elements/Table';


export const UrlsField = ({
	parentPath,
	value
}) => {
	const path = `${parentPath}.urls`;
	/*console.log(JSON.stringify({
		parentPath,
		value
	}, null, 4));*/

	return <Fieldset legend="Url(s)">
		<Table headers={['Url', 'Action(s)']}>
			<FieldArray
				name={path}
				render={() => value.map((anUrl, index) => {
					const key = `${path}[${index}]`;
					return <tr key={key}>
						<td><Field autoComplete="off" name={key} value={anUrl} /></td>
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
	</Fieldset>
};
