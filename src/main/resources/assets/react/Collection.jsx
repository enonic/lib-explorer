import {Form, Formik} from 'formik';
import {SubmitButton} from './buttons/SubmitButton';
import {NameField} from './fields/NameField';
import {Surgeon} from './fields/Surgeon';
//import {toStr} from './utils/toStr';


export const Collection = ({
	action,
	fields = [],
	tags = [],
	initialValues = {
		collector: {
			config: { // Avoid uncontrolled to controlled warning:
				delay: 1000,
				download: [],
				dynamic: false,
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
		setFieldValue,
		values
	}) => /*{
		console.log(toStr({fields, tags, values}));
		return */<Form
			action={action}
			autoComplete="off"
			method="POST"
			onSubmit={() => {
				document.getElementById('json').setAttribute('value', JSON.stringify(values))
			}}
		>
			<NameField/>
			<Surgeon
				fields={fields}
				path='collector.config'
				setFieldValue={setFieldValue}
				tags={tags}
				values={values}
			/>
			<SubmitButton text="Save collection"/>
			<input id="json" name="json" type="hidden"/>
		</Form>/*}*/}
/>; // Collection
