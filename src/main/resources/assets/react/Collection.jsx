import {Form, Formik} from 'formik';
import {SubmitButton} from './semantic-ui/SubmitButton';
import {TextInput} from './elements/TextInput';
import {Surgeon} from './fields/Surgeon';
//import {toStr} from './utils/toStr';

import {Field} from './semantic-ui/Field';


export const Collection = ({
	action,
	fields = [],
	fieldsObj = {},
	tags = [],
	initialValues = {
		collector: {
			config: { // Avoid uncontrolled to controlled warning:
				connectionTimeout: 10000,
				delay: 1000,
				download: [],
				dynamic: false,
				readTimeout: 10000,
				retries: 1,
				urls: [''] // At least one is required
			},
			name: 'surgeon'
		},
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
			fieldsObj//,
			//tags,
			//values
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
			<Surgeon
				fields={fields}
				fieldsObj={fieldsObj}
				path='collector.config'
				tags={tags}
			/>
			<Field><SubmitButton className='primary' text="Save collection"/></Field>
			<input id="json" name="json" type="hidden"/>
		</Form>}}
/>; // Collection
