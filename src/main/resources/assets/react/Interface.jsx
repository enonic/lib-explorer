import {Form, Formik} from 'formik';
import {SubmitButton} from './buttons/SubmitButton';

// Elements
import {Select} from './elements/Select';

import {DEFAULT_GROUP_EXPRESSION} from './fields/constants'
import {NameField} from './fields/NameField';
import {ExpressionSelector} from './fields/ExpressionSelector';

import {toStr} from './utils/toStr';


export const Interface = ({
	action,
	collections,
	fields,
	initialValues = {
		name: '',
		collections: [],
		query: DEFAULT_GROUP_EXPRESSION
	}
} = {}) => <Formik
	initialValues={initialValues}
	render={({
		handleSubmit,
		setFieldValue,
		values
	}) => {
		console.debug(toStr({values}));
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
				values={values}
			/>
			<ExpressionSelector
				fields={fields}
				legend='Query'
				name='query'
				setFieldValue={setFieldValue}
				values={values}
			/>
			<SubmitButton text="Save interface"/>
			<input id="json" name="json" type="hidden"/>
		</Form>}}
/>; // Interface
