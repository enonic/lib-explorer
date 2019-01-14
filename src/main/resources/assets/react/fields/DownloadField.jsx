import {Field, FieldArray} from 'formik';
import {capitalize} from 'lodash';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Label} from '../elements/Label';


export const DownloadField = ({path, setFieldValue, value}) => {
	//console.log(JSON.stringify({path, setFieldValue, value}, null, 4));
	if(!(value && Array.isArray(value) && value.length)) {
		return <SetFieldValueButton className='block' field={path} value={['']} setFieldValue={setFieldValue} text="Add download expression(s)"/>
	}
	return <Label label={capitalize(path)}>
		<FieldArray
			name={path}
			render={({insert, swap, remove}) => value.map((aDownloadExpression, index) => (
				<React.Fragment key={`${path}[${index}]`}>
					<Field name={`${path}[${index}]`} />
					<InsertButton index={index} insert={insert} value={''}/>
					<RemoveButton index={index} remove={remove}/>
					<MoveDownButton disabled={index === value.length-1} index={index} swap={swap} visible={value.length > 1}/>
					<MoveUpButton index={index} swap={swap} visible={value.length > 1}/>
				</React.Fragment>
			))}
		/>
	</Label>;
}
