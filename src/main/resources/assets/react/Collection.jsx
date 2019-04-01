import {Form, Formik, getIn} from 'formik';
import {SubmitButton} from './semantic-ui/SubmitButton';
import {TextInput} from './elements/TextInput';
import {Surgeon} from './collectors/surgeon/Surgeon';
//import {toStr} from './utils/toStr';

import {Select} from './elements/Select';
import {Field} from './semantic-ui/Field';


export const Collection = ({
	action,
	fields = [],
	fieldsObj = {},
	tags = [],
	initialValues = {
		/*collector: {
			name: 'surgeon'
			config: {}
		},*/
		name: ''
	}
} = {}) => <Formik
	initialValues={initialValues}
	render={({
		handleSubmit,
		values
	}) => {
		/*console.log(toStr({
			//fields,
			//fieldsObj,
			//tags,
			values
		}));*/
		return <Form
			action={action}
			autoComplete="off"
			className='ui form'
			method="POST"
			onSubmit={() => {
				document.getElementById('json').setAttribute('value', JSON.stringify(values))
			}}
			style={{
				width: '100%'
			}}
		>
			<TextInput
				id='name'
				label="Name"
				name="name"
			/>
			<Select
				path='collector.name'
				options={[{
					label: 'Surgeon',
					value: 'surgeon'
				}]}
				placeholder= 'Please select a collector'
			/>
			{getIn(values, 'collector.name') === 'surgeon' ? <Surgeon
				fields={fields}
				fieldsObj={fieldsObj}
				path='collector.config'
				tags={tags}
			/> : null}
			<Field><SubmitButton className='primary' text="Save collection"/></Field>
			<input id="json" name="json" type="hidden"/>
		</Form>}}
/>; // Collection
