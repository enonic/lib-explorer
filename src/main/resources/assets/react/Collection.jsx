import {connect, Form, Formik, getIn} from 'formik';
import {SubmitButton} from './semantic-ui/SubmitButton';
import {TextInput} from './elements/TextInput';
import {Surgeon} from './collectors/surgeon/Surgeon';
import {Cron} from './fields/Cron';
//import {toStr} from './utils/toStr';

import {Select} from './elements/Select';

import {Checkbox} from './semantic-ui/Checkbox';
import {Field} from './semantic-ui/Field';
import {Header} from './semantic-ui/Header';
import {Dropdown} from './semantic-ui/react/formik/Dropdown';


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
} = {}) => {
	const collectorsObj = {};
	Object.keys(window.collectors).forEach(k => {
		collectorsObj[k] = connect(window.collectors[k]);
	});
	return <Formik
		initialValues={initialValues}
		render={({
			handleSubmit,
			setFieldValue,
			values
		}) => {
			/*console.debug(toStr({
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
				<Dropdown
					defaultValue={getIn(values, 'collector.name', '')}
					path='collector.name'
					onChange={(event, {value: newType}) => {
						//console.debug({event, newType});
						setFieldValue('collector', {
							name: newType,
							config: {}
						})
					}}
					options={Object.keys(collectors).map(key => ({
						key,
						text: key,
						value: key
					}))}
					placeholder='Please select a collector'
				/>
				<div>
					{values.collector && values.collector.name ? collectorsObj[values.collector.name]() : null}
				</div>
				<Select
					path='collector.name'
					options={[{
						label: 'Surgeon',
						value: 'surgeon'
					}]}
					placeholder='Please select a collector'
				/>
				{getIn(values, 'collector.name') === 'surgeon' ? <Surgeon
					fields={fields}
					path='collector.config'
				/> : null}
				<Field><SubmitButton className='primary' text="Save collection"/></Field>
				<input id="json" name="json" type="hidden"/>
			</Form>}}
	/>; // Collection
}
