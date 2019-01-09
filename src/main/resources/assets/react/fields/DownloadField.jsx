import {Field, FieldArray} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';


export const DownloadField = ({path, setFieldValue, value}) => {
	//console.log(JSON.stringify({path, setFieldValue, value}, null, 4));
	if(!(value && Array.isArray(value) && value.length)) {
		return <SetFieldValueButton field={path} value={['']} setFieldValue={setFieldValue} text="Add download expression(s)"/>
	}
	return <FieldArray
		name={path}
		render={({insert, swap, remove}) => value.map((aDownloadExpression, index) => (
			<div key={`${path}[${index}]`}>
				{/*<button type="button" onClick={() => insert(index, '')}>⎀</button>*/}
				<Field name={`${path}[${index}]`} />
				<RemoveButton index={index} remove={remove}/>
				{index ? <MoveUpButton index={index} swap={swap}/> : null}
				{index < value.length-1 ? <MoveDownButton index={index} swap={swap}/> : null}
				<InsertButton index={index} insert={insert} value={''}/>
			</div>
		))}
	/>;
}
