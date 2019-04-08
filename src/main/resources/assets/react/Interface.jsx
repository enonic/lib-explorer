import {Form, Formik} from 'formik';
import generateUuidv4 from 'uuid/v4';

import {SubmitButton} from './semantic-ui/SubmitButton';

import {Select} from './elements/Select';
import {TextInput} from './elements/TextInput';

import {ExpressionSelector} from './query/ExpressionSelector';
import {Pagination} from './query/Pagination'
import {QueryFiltersBuilder} from './query/filter/QueryFiltersBuilder';
import {Facets} from './query/Facets';
import {ResultMappings} from './query/ResultMappings';

//import {toStr} from './utils/toStr';


export const Interface = ({
	action,
	collections,
	fields,
	fieldsObj,
	initialValues = {
		name: '',
		collections: [],
		query: {},
		resultMappings: [{
			field: '',
			highlight: false,
			join: true,
			lengthLimit: '',
			separator: ' ',
			to: '',
			uuid4: generateUuidv4()
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
	thesauriOptions
} = {}) => <Formik
	initialValues={initialValues}
	render={({
		handleSubmit,
		values
	}) => {
		/*console.debug(toStr({
			component: 'Interface',
			//collections,
			//fields,
			//fieldsObj,
			//tags,
			//thesauriOptions,
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
				thesauriOptions={thesauriOptions}
			/>
			<ResultMappings
				fields={fields}
				legend='Result mapping(s)'
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
