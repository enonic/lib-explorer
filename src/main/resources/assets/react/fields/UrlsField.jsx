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
					{urls.length > 1 ? <RemoveButton index={index} remove={remove}/> : null}
					{index ? <MoveUpButton index={index} swap={swap}/> : null}
					{index < urls.length-1 ? <MoveDownButton index={index} swap={swap}/> : null}
					<InsertButton index={index} insert={insert} value={''}/>
				</div>
			))}
		/>
	</Label>;
