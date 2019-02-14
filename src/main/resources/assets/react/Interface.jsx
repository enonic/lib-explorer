import {Form, Formik} from 'formik';
import {SubmitButton} from './buttons/SubmitButton';

// Elements
import {Fieldset} from './elements/Fieldset';
import {Radio} from './elements/Radio';
import {Select} from './elements/Select';

import {NameField} from './fields/NameField';
import {Fulltext} from './fields/Fulltext';


import {toStr} from './utils/toStr';


export const Interface = ({
	action,
	collections,
	fields,
	initialValues = {
		name: '',
		collections: []/*,
		fulltext: [{
			field: 'title',
			boost: 1
		}]*/
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
			{/*<Select
				label="Field"
				name="field"
				options={fields}
				setFieldValue={setFieldValue}
				value={values.field}
			/>*/}
			<Fieldset legend="Query">
				<Radio
					label="Group"
					name="query"
					value="group"
				/>
				<Radio
					label="Fulltext"
					name="query"
					value="fulltext"
				/>
				<Radio
					label="Ngram"
					name="query"
					value="ngram"
				/>
			</Fieldset>
			<Fulltext
				fields={fields}
				path="fulltext"
				setFieldValue={setFieldValue}
				value={values.fulltext}
			/>
			<SubmitButton text="Save interface"/>
			<input id="json" name="json" type="hidden"/>
		</Form>}}
/>; // Interface
