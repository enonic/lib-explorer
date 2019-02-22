import {Form, Formik} from 'formik';
import traverse from 'traverse';
import generateUuidv4 from 'uuid/v4';

import {SubmitButton} from './buttons/SubmitButton';

// Elements
import {Select} from './elements/Select';

import {NameField} from './fields/NameField';
import {ExpressionSelector} from './fields/ExpressionSelector';
import {Facets} from './fields/Facets';
import {ResultMappings} from './fields/ResultMappings';

import {toStr} from './utils/toStr';


function convert(node) {
	traverse(node).forEach(function(value) { // Fat arrow destroys this
		const key = this.key;
		if ([
			'expressions',
			'facets',
			'fields',
			'resultMappings'
		].includes(key)) {
			if (!value) {
				this.update([]);
			} else if (!Array.isArray(value)) { // Convert single value to array
				const array = [value];
				convert(array); // Recurse
				this.update(array);
			} else if (Array.isArray(value)) {
				this.update(value.map(entry => {
					if (!entry.uuid4) {
						entry.uuid4 = generateUuidv4();//seqenceCounter;
					}
					return entry;
				}));
			} // if isArray
		} // if key
	}); // traverse
} // convert


export const Interface = ({
	action,
	collections,
	fields,
	initialValues = {
		name: '',
		collections: [],
		query: {
			type: 'group',
			params: {
				expressions: [{
					type: 'fulltext',
					params: {
						fields: [{
							field: '',
							boost: ''
						}],
						operator: 'or'
					}
				}], // expressions
				operator: 'or'
			} // params
		}, // query
		resultMappings: [{
			field: '',
			highlight: false,
			lengthLimit: '',
			to: ''
		}],
		facets: []
	},
	tags
} = {}) => <Formik
	initialValues={initialValues}
	render={({
		handleSubmit,
		setFieldValue,
		values
	}) => {
		convert(values);
		console.debug(toStr({
			//tags,
			values
		}));
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
			<ResultMappings
				fields={fields}
				legend='Result mapping(s)'
				setFieldValue={setFieldValue}
				values={values}
			/>
			<Facets
				legend='Facet(s)'
				setFieldValue={setFieldValue}
				tags={tags}
				values={values}
			/>
			<SubmitButton text="Save interface"/>
			<input id="json" name="json" type="hidden"/>
		</Form>}}
/>; // Interface
