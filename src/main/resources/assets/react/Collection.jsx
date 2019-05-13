import {connect, Formik, getIn} from 'formik';
import {Form, Header} from 'semantic-ui-react';
import traverse from 'traverse';

import {SubmitButton} from './semantic-ui/SubmitButton';
import {Surgeon} from './collectors/surgeon/Surgeon';
import {Cron} from './fields/Cron';
import {toStr} from './utils/toStr';

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


const loadDynamicScript = ({
	fn,
	id,
	src
}) => {
	const existingScript = document.getElementById(id);

	if (!existingScript) {
		const script = document.createElement('script');
		script.src = src;
		script.id = id;
		document.body.appendChild(script);

		script.onload = () => {
			if (fn) fn();
		};
	}

	if (existingScript && fn) fn();
};


export const Collection = ({
	action,
	collectorOptions,
	collectorsAppToUri,
	fields = {},
	initialValues = {
		name: ''
	}
} = {}) => {
	console.debug(toStr({
		collectorOptions,
		collectorsAppToUri
	}));
	/*const collectorsObj = {};
	Object.keys(window.collectors).forEach(k => {
		collectorsObj[k] = connect(window.collectors[k]);
	});*/
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
						onChange={(event, {value: collectorAppName}) => {
							//console.debug({event, collectorAppName});
							loadDynamicScript({
								id: collectorAppName,
								src: collectorsAppToUri[collectorAppName],
								fn: () => {
									setFieldValue('collector', {
										name: collectorAppName,
										config: {}
									})
								}
							});
						}}
						options={collectorOptions}
						placeholder='Please select a collector'
						selection
					/>
				</Form.Field>
				<div>
					{values.collector
						&& values.collector.name
						&& window[values.collector]
						&& window[values.collector].Collector
						? window[values.collector].Collector({fields, formik})
						: null}
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
