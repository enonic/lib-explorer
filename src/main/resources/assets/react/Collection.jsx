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
	delay = 1000,
	headers = null,
	name = '',
	node = null,
	pathRange = null,
	queryRange = null,
	urls = [''] // At least one is required
}) => (
	<div>
		<Formik
			initialValues={{
				delay,
				headers,
				name,
				node,
				pathRange,
				queryRange,
				urls
			}}
			onSubmit={values => {
				console.log(JSON.Stringify(values, null, 4));
			}}
			render={({
				setFieldValue,
				setValues,
				values: {
					delay,
					headers,
					name,
					node,
					pathRange,
					queryRange,
					urls
				}
			}) => {
				/*console.log(JSON.stringify({
					delay,
					headers,
					name,
					node,
					pathRange,
					queryRange,
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
					</Fieldset>{/* Request */}
					<ScrapeField path="node.scrape" value={node && node.scrape} setFieldValue={setFieldValue}/>
					<DownloadField path="node.download" value={node && node.download} setFieldValue={setFieldValue}/>
					<CrawlField path="node.crawl" value={node && node.crawl} setFieldValue={setFieldValue}/>
					<SubmitButton text="Save collection"/>
				</Form>);
			}}
		/>
	</div>
); // Collection
