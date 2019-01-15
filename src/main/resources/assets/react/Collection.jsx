import {Form, Formik} from 'formik';
import {SubmitButton} from './buttons/SubmitButton';
import {NameField} from './fields/NameField';
import {Surgeon} from './fields/Surgeon';


export const Collection = ({
	action,
	fields = [],
	tags = [],
	initialValues = {
		collector: {
			config: { // Avoid uncontrolled to controlled warning:
				delay: 1000,
				download: [],
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
		console.log(JSON.stringify({fields, tags, values}, null, 4));
		return */<Form action={action} autoComplete="off" method="POST" onSubmit={(/*event*/) => {
			//event.preventDefault();
			//console.log(this); // undefined
			//console.log(event);
			//console.log(values);
			const el = document.getElementById('json'); //console.log(el);
			el.setAttribute('value', JSON.stringify(values)); //console.log(el);
		}}>
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
