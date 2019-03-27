import {Form, Formik} from 'formik';
import traverse from 'traverse';
import generateUuidv4 from 'uuid/v4';

import {SubmitButton} from './semantic-ui/SubmitButton';

// Elements
import {Select} from './elements/Select';
import {TextInput} from './elements/TextInput';

import {ExpressionSelector} from './fields/ExpressionSelector';
import {QueryFiltersBuilder} from './fields/QueryFiltersBuilder';
import {Facets} from './fields/Facets';
import {Pagination} from './fields/Pagination'
import {ResultMappings} from './fields/ResultMappings';

import {toStr} from './utils/toStr';


function convert(node) {
	traverse(node).forEach(function(value) { // Fat arrow destroys this
		const key = this.key;
		if ([
			'expressions',
			'facets',
			'fields',
			'must',
			'mustNot',
			'resultMappings',
			'values'
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
	fieldsObj,
	initialValues = {
		name: '',
		collections: [],
		thesauri: [],
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
		facets: [],
		pagination: {
			pagesToShow: 10,
			first: true,
			prev: true,
			next: true,
			last: true
		}
	},
	tags,
	thesauri
} = {}) => <Formik
	initialValues={initialValues}
	render={({
		handleSubmit,
		values
	}) => {
		convert(values);
		console.debug(toStr({
			component: 'Interface',
			//collections,
			//fields,
			fieldsObj//,
			//tags,
			//thesauri,
			//values
		}));
		return <Form
			action={action}
			autoComplete="off"
			className='ui form'
			method="POST"
			onSubmit={() => {
				document.getElementById('json').setAttribute('value', JSON.stringify(values))
			}}
		>
			<TextInput
				label="Name"
				name="name"
			/>
			<Select
				label="Collection(s)"
				multiple={true}
				name="collections"
				options={collections}
				values={values}
			/>
			<QueryFiltersBuilder
				fields={fields}
				tags={tags}
			/>
			<ExpressionSelector
				fields={fields}
				legend='Query'
				name='query'
			/>
			<ResultMappings
				fields={fields}
				legend='Result mapping(s)'
			/>
			<Select
				label="Thesauri"
				multiple={true}
				name="thesauri"
				options={thesauri}
			/>
			<Facets
				fields={fields.map(({label, path: value}) => ({label, value}))}
				legend='Facet(s)'
				tags={tags}
			/>
			<Pagination
				legend='Pagination'
			/>
			<SubmitButton className='primary' text="Save interface"/>
			<input id="json" name="json" type="hidden"/>
		</Form>}}
/>; // Interface
