import {connect, Formik, getIn} from 'formik';
import {Form, Header} from 'semantic-ui-react';
import traverse from 'traverse';

import {SubmitButton} from './semantic-ui/SubmitButton';
import {Surgeon} from './collectors/surgeon/Surgeon';
import {Cron} from './fields/Cron';
//import {toStr} from './utils/toStr';

import {Select} from './elements/Select';

import {Checkbox} from './semantic-ui/Checkbox';
import {
	Dropdown,
	Input
} from '@h3t/semantic-ui-react-formik-functional/dist/index.cjs';

function convert(node) {
	traverse(node).forEach(function(value) { // Fat arrow destroys this
		const key = this.key;
		//log.info(toStr({key}));
		if([
			'crawl',
			'download',
			'fields',
			'headers',
			'queryParams',
			'scrape',
			'scrapeExpression',
			'scrapeJson',
			'tags',
			'urls',
			'urlExpression'
			//'value' // Nope this will destroy headers[index].value
		].includes(key)) {
			if (!value) {
				this.update([]);
			} else if (!Array.isArray(value)) {
				const array = [value];
				convert(array); // Recurse
				this.update(array);
			}
		}
	});
}


export const Collection = ({
	action,
	fields = {},
	initialValues = {
		name: ''
	}
} = {}) => {
	const collectorsObj = {};
	Object.keys(window.collectors).forEach(k => {
		collectorsObj[k] = connect(window.collectors[k]);
	});
	convert(initialValues);
	return <Formik
		initialValues={initialValues}
		render={formik => {
			const {
				handleSubmit,
				setFieldValue,
				values
			} = formik;
			//console.debug(formik);
			/*console.debug(toStr({
				//fields,
				values
			}));*/
			return <Form
				action={action}
				autoComplete="off"
				method="POST"
				onSubmit={() => {
					document.getElementById('json').setAttribute('value', JSON.stringify(values))
				}}
				style={{
					width: '100%'
				}}
			>
				<Form.Field>
					<Input
						id='name'
						fluid
						formik={formik}
						label={{ basic: true, content: 'Name' }}
						name='name'
					/>
				</Form.Field>
				<Form.Field>
					<Checkbox
						name='doCollect'
						label='Collect?'
					/>
				</Form.Field>
				<Cron/>
				<Header as='h2' dividing content='Collector'/>
				<Form.Field>
					<Dropdown
						defaultValue={getIn(values, 'collector.name', '')}
						formik={formik}
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
						selection
					/>
				</Form.Field>
				<div>
					{values.collector && values.collector.name ? collectorsObj[values.collector.name]({fields, formik}) : null}
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
				<Form.Field>
					<SubmitButton className='primary' text="Save collection"/>
				</Form.Field>
				<input id="json" name="json" type="hidden"/>
			</Form>}}
	/>; // Collection
}
