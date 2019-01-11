/* global React */
import {Field, FieldArray, Form, Formik} from 'formik';

// Buttons
import {InsertButton} from './buttons/InsertButton';
import {MoveUpButton} from './buttons/MoveUpButton';
import {MoveDownButton} from './buttons/MoveDownButton';
import {RemoveButton} from './buttons/RemoveButton';
import {SetFieldValueButton} from './buttons/SetFieldValueButton';
import {SubmitButton} from './buttons/SubmitButton';

// Elements
import {Fieldset} from './elements/Fieldset';
import {Label} from './elements/Label';
import {LabeledField} from './elements/LabeledField';
import {Table} from './elements/Table';

// Fields
import {CrawlField} from './fields/CrawlField';
import {DelayField} from './fields/DelayField';
import {DownloadField} from './fields/DownloadField';
import {HeadersField} from './fields/HeadersField';
import {NameField} from './fields/NameField';
import {PathRangeField} from './fields/PathRangeField';
import {QueryRangeField} from './fields/QueryRangeField';
import {ScrapeField} from './fields/ScrapeField';
import {UrlsField} from './fields/UrlsField';

//import {Node} from './Node';
// ERROR The next line cause runtime errors!
//import React, { Component } from 'react';


export const Collection = ({
	crawl,
	delay = 1000,
	download,
	fields,
	headers,
	name = '',
	node,
	pathRange,
	queryRange,
	scrape,
	urls = [''] // At least one is required
}) => (
	<div>
		<Formik
			initialValues={{
				crawl,
				delay,
				download,
				fields,
				headers,
				name,
				pathRange,
				queryRange,
				scrape,
				urls
			}}
			onSubmit={values => {
				console.log(JSON.Stringify(values, null, 4));
			}}
			render={({
				setFieldValue,
				setValues,
				values: {
					crawl,
					delay,
					download,
					fields,
					headers,
					name,
					pathRange,
					queryRange,
					scrape,
					urls
				}
			}) => {
				/*console.log(JSON.stringify({
					crawl,
					delay,
					download,
					headers,
					name,
					pathRange,
					queryRange,
					scrape,
					urls
				}, null, 4));*/
				return (<Form>
					<NameField name={name}/>
					<Fieldset legend="Request">
						<UrlsField urls={urls}/>
						<PathRangeField pathRange={pathRange} setFieldValue={setFieldValue}/>
						<QueryRangeField queryRange={queryRange} setFieldValue={setFieldValue}/>
						<HeadersField headers={headers} setFieldValue={setFieldValue}/>
						<DelayField delay={delay}/>
					</Fieldset>
					<ScrapeField fields={fields} path="scrape" value={scrape} setFieldValue={setFieldValue}/>
					<DownloadField path="download" value={download} setFieldValue={setFieldValue}/>
					<CrawlField fields={fields} path="crawl" value={crawl} setFieldValue={setFieldValue}/>
					<SubmitButton text="Save collection"/>
				</Form>);
			}}
		/>
	</div>
); // Collection
