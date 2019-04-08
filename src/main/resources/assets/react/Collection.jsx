import {Form, Formik, getIn} from 'formik';
import {SubmitButton} from './semantic-ui/SubmitButton';
import {TextInput} from './elements/TextInput';
import {Surgeon} from './collectors/surgeon/Surgeon';
import {Cron} from './fields/Cron';
//import {toStr} from './utils/toStr';

import {Select} from './elements/Select';

import {Checkbox} from './semantic-ui/Checkbox';
import {Field} from './semantic-ui/Field';
import {Header} from './semantic-ui/Header';


export const Collection = ({
	action,
	fields = {},
	initialValues = {
		/*collector: {
			name: 'surgeon'
			config: {}
		},*/
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
				id='name'
				label="Name"
				name="name"
			/>
			<Checkbox
				name='doCollect'
				label='Collect?'
			/>
			<Cron/>
			<Header h2 dividing text='Collector'/>
			<Select
				path='collector.name'
				options={[{
					label: 'Surgeon',
					value: 'surgeon'
				}]}
				placeholder= 'Please select a collector'
			/>
			{getIn(values, 'collector.name') === 'surgeon' ? <Surgeon
				fields={fields}
				path='collector.config'
			/> : null}
			<Field><SubmitButton className='primary' text="Save collection"/></Field>
			<input id="json" name="json" type="hidden"/>
		</Form>}}
/>; // Collection
