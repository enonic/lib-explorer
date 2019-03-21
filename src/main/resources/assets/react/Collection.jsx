import {Form, Formik} from 'formik';
import {SubmitButton} from './buttons/SubmitButton';
import {TextInput} from './elements/TextInput';
import {Surgeon} from './fields/Surgeon';
import {toStr} from './utils/toStr';


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
			//tags,
			values
		}));*/
		return <Form
			action={action}
			autoComplete="off"
			method="POST"
			onSubmit={() => {
				document.getElementById('json').setAttribute('value', JSON.stringify(values))
			}}
		>
			<TextInput
				label="Name"
				name="name"
			/>
			<Surgeon
				fields={fields}
				fieldsObj={fieldsObj}
				path='collector.config'
				tags={tags}
			/>
			<SubmitButton text="Save collection"/>
			<input id="json" name="json" type="hidden"/>
		</Form>}}
/>; // Collection
