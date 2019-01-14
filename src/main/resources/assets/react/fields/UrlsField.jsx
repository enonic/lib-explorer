import {Field, FieldArray} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Fieldset} from '../elements/Fieldset';
import {Label} from '../elements/Label';


export const UrlsField = ({
	path,
	value = [''] // At least one is required
}) => /*{
	console.log(JSON.stringify({
		path,
		value
	}, null, 4));
	return */<Label label={`Url (${path})`}>
		<FieldArray
			name={path}
			render={({insert, swap, remove}) => value && value.map((anUrl, index) => (
				<React.Fragment key={`${path}[${index}]`}>
					<Field name={`${path}[${index}]`} />
					<InsertButton index={index} insert={insert} value={''}/>
					<RemoveButton index={index} remove={remove} visible={value.length > 1}/>
					<MoveDownButton disabled={index === value.length-1} index={index} swap={swap} visible={value.length > 1}/>
					<MoveUpButton index={index} swap={swap} visible={value.length > 1}/>
				</React.Fragment>
			))}
		/>
	</Label>/*}*/;
