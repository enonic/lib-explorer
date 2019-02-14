import {Form, Formik} from 'formik';
import {SubmitButton} from './buttons/SubmitButton';
import {NameField} from './fields/NameField';
import {Select} from './elements/Select';
import {toStr} from './utils/toStr';


export const Interface = ({
	action,
	collections,
	initialValues = {
		name: '',
		collections: []
	}
} = {}) => <Formik
	initialValues={initialValues}
	render={({
		handleSubmit,
		setFieldValue,
		values
	}) => {
		console.log(toStr({values}));
		return <Form
			action={action}
			autoComplete="off"
			method="POST"
			onSubmit={() => {
				document.getElementById('json').setAttribute('value', JSON.stringify(values))
			}}
		>
			<NameField
				label="Name"
				name="name"
				value={values.name}
			/>
			<Select
				label="Collection(s)"
				multiple={true}
				name="collections"
				options={collections}
				setFieldValue={setFieldValue}
				value={values.collections}
			/>
			<SubmitButton text="Save interface"/>
			<input id="json" name="json" type="hidden"/>
		</Form>}}
/>; // Interface
