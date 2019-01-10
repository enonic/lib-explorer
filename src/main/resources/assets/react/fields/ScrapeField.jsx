import {FieldArray} from 'formik';
import {capitalize} from 'lodash';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';


export const ScrapeField = ({path, setFieldValue, value}) => {
	//console.log(JSON.stringify({path, value}, null, 4));
	if(!(value && Array.isArray(value) && value.length)) {
		return <SetFieldValueButton className='block' field={path} value={[{field: '', dataExpr: ''}]} setFieldValue={setFieldValue} text="Add scrape field"/>
	}
	return <Fieldset legend={capitalize(path)}>
		<FieldArray
			name={path}
			render={({insert, swap, remove}) => value.map(({field, dataExpr}, index) => (
				<div key={`${path}[${index}]`}>
					<LabeledField label="Field" name={`${path}[${index}].field`}/>
					<LabeledField label="Data extraction expression" name={`${path}[${index}].dataExpr`}/>
					<InsertButton index={index} insert={insert} value={{field: '', dataExpr: ''}}/>
					<RemoveButton index={index} remove={remove}/>
					<MoveDownButton disabled={index === value.length-1} index={index} swap={swap} visible={value.length > 1}/>
					<MoveUpButton index={index} swap={swap} visible={value.length > 1}/>
				</div>
			))}
		/>
	</Fieldset>;
};
