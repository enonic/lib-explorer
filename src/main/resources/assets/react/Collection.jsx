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

async function delay(ms) {
	// return await for better async stack trace support in case of errors.
	return await new Promise(resolve => setTimeout(resolve, ms));
}


function assert(fn) {
	while (!fn()) {
		delay(100);
	}
	/*let result = false;
	const checkExist = setInterval(() => {
   		if (fn()) {
			result = true;
      		clearInterval(checkExist);
   		}
	}, 100);*/
}


async function injectScriptSync({id, src}) {
	console.debug(toStr({id, src}));
	const response = await fetch(src);
	const text = await result.text();
	console.debug(text);
	const s = document.createElement('script');
	s.type = 'text/javascript';
	s.appendChild(document.createTextNode(text));
	const head = document.head || document.getElementsByTagName('head')[0];
	head.insertBefore(s, head.firstChild);
	console.debug(`window[${id}]`, window[id]);
}


async function loadDynamicScript({
	fn,
	id,
	src
}) {
	console.debug(toStr({id, src}));

	const existingScript = document.getElementById(id);

	if (!existingScript) {
		const script = document.createElement('script');
		script.async = false;
		script.defer = false;
		script.src = src;
		script.id = id;

		const head = document.head || document.getElementsByTagName('head')[0];
		head.insertBefore(script, head.firstChild);
		//document.body.appendChild(script);

		/*script.onload = () => { // Async
			if (fn) fn();
		};*/
	}
	while (!window[id]) {
		await delay(100);
	}

	//if (existingScript && fn) fn();
	fn();
}


export const Collection = ({
	action,
	collectorsObj,
	collectorOptions,
	collectorsAppToUri,
	fields = {},
	initialValues = {
		name: ''
	}
} = {}) => {
	console.debug(collectorsObj);
	/*console.debug(toStr({
		collectorsObj,
		collectorOptions,
		collectorsAppToUri
	}));*/
	/*const collectorsObj = {};
	Object.keys(window.collectors).forEach(k => {
		collectorsObj[k] = connect(window.collectors[k]);
	});*/
	convert(initialValues);
	if (initialValues.collector && initialValues.collector.name) {
		/*(async () => {
			const {Collector} = await import(collectorsAppToUri[initialValues.collector.name]);
			console.debug(Collector);
		})();*/
		/*injectScriptSync({
			id: initialValues.collector.name,
			src: collectorsAppToUri[initialValues.collector.name]
		});*/
		/*loadDynamicScript({
			id: initialValues.collector.name,
			src: collectorsAppToUri[initialValues.collector.name],
			fn: () => {
				console.debug(`window[${initialValues.collector.name}]`, window[initialValues.collector.name]);
				console.debug(`window[${initialValues.collector.name}].Collector`, window[initialValues.collector.name].Collector);
			}
		});*/
	}
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
							injectScriptSync({
								id: collectorAppName,
								src: collectorsAppToUri[collectorAppName]
							});
							/*loadDynamicScript({
								id: collectorAppName,
								src: collectorsAppToUri[collectorAppName],
								fn: () => {
									console.debug(window[collectorAppName]);
									console.debug(window[collectorAppName].Collector);
									setFieldValue('collector', {
										name: collectorAppName,
										config: {}
									})
								}
							});*/
						}}
						options={collectorOptions}
						placeholder='Please select a collector'
						selection
					/>
				</Form.Field>
				<div>
					{values.collector
						&& values.collector.name
						&& window[values.collector.name]
						&& window[values.collector.name].Collector
						? window[values.collector.name].Collector({fields, formik})
						: null}
				</div>
				{/*<Select
					path='collector.name'
					options={[{
						label: 'Surgeon',
						value: 'surgeon'
					}]}
					placeholder='Please select a collector'
				/>*/}
				{/*getIn(values, 'collector.name') === 'surgeon' ? <Surgeon
					fields={fields}
					path='collector.config'
				/> : null*/}
				<Form.Field>
					<SubmitButton className='primary' text="Save collection"/>
				</Form.Field>
				<input id="json" name="json" type="hidden"/>
			</Form>}}
	/>; // Collection
}
