import {Field, FieldArray} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Fieldset} from '../elements/Fieldset';
import {Label} from '../elements/Label';


export const UrlsField = ({urls}) =>
	<Label label="Url">
		<FieldArray
			name="urls"
			render={({insert, swap, remove}) => urls && urls.map((anUrl, index) => (
				<div key={`urls[${index}]`}>
					<Field name={`urls[${index}]`} />
					<InsertButton index={index} insert={insert} value={''}/>
					<RemoveButton index={index} remove={remove} visible={urls.length > 1}/>
					<MoveDownButton disabled={index === urls.length-1} index={index} swap={swap} visible={urls.length > 1}/>
					<MoveUpButton index={index} swap={swap} visible={urls.length > 1}/>
				</div>
			))}
		/>
	</Label>;
