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
import {DelayField} from './fields/DelayField';
import {HeadersField} from './fields/HeadersField';
import {NameField} from './fields/NameField';
import {PathRangeField} from './fields/PathRangeField';
import {QueryRangeField} from './fields/QueryRangeField';
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
				console.log(JSON.stringify({
					delay,
					headers,
					name,
					node,
					pathRange,
					queryRange,
					urls
				}, null, 4));
				return (<Form>
					<NameField name={name}/>

					<Fieldset legend="Request">
						<UrlsField urls={urls}/>
						<PathRangeField pathRange={pathRange} setFieldValue={setFieldValue}/>
						<QueryRangeField queryRange={queryRange} setFieldValue={setFieldValue}/>
						<HeadersField headers={headers} setFieldValue={setFieldValue}/>
						<DelayField delay={delay}/>
					</Fieldset>{/* Request */}

					{node && node.scrape && node.scrape.length
						? (<FieldArray
								name="node.scrape"
								render={({insert, swap, remove}) => (
									<div>
										{node.scrape && node.scrape.length > 0 && node.scrape.map(({field, dataExpr}, index) => (
											<Fieldset key={index} legend={`Scrape[${index}]`}>
												{/*<button type="button" onClick={() => insert(index, {field: '', dataExpr: ''})}>+</button>*/}
												<LabeledField label="Field" name={`node.scrape[${index}].field`}/>
												<LabeledField label="Data extraction expression" name={`node.scrape[${index}].dataExpr`}/>
												<RemoveButton index={index} remove={remove}/>
												{index ? <MoveUpButton index={index} swap={swap}/> : null}
												{index < node.scrape.length-1 ? <MoveDownButton index={index} swap={swap}/> : null}
												<InsertButton index={index} insert={insert} value={{field: '', dataExpr: ''}}/>
											</Fieldset>
										))}
									</div>
								)}
							/>)
						: <SetFieldValueButton field='node.scrape' value={[{field: '', dataExpr: ''}]} setFieldValue={setFieldValue} text="Add scrape field"/>
					}



					{node && node.download && node.download.length
						? (<FieldArray
								name="node.download"
								render={({insert, swap, remove}) => (
									<div>
										{node.download && node.download.length > 0 && node.download.map((aDownloadExpression, index) => (
											<div key={index}>
												{/*<button type="button" onClick={() => insert(index, '')}>⎀</button>*/}
												<Field name={`node.download[${index}]`} />
												<RemoveButton index={index} remove={remove}/>
												{index ? <MoveUpButton index={index} swap={swap}/> : null}
												{index < node.download.length-1 ? <MoveDownButton index={index} swap={swap}/> : null}
												<InsertButton index={index} insert={insert} value={''}/>
											</div>
										))}
									</div>
								)}
							/>)
						: <SetFieldValueButton field='node.download' value={['']} setFieldValue={setFieldValue} text="Add download expression(s)"/>
					}

					{node && node.crawl && node.crawl.length
						? (<FieldArray
								name="node.crawl"
								render={({insert, swap, remove}) => (
									<div>
										{node.crawl && node.crawl.length > 0 && node.crawl.map(({dynamic, urlExpr}, index) => (
											<Fieldset key={index} legend={`Crawl[${index}]`}>
												{/*<button type="button" onClick={() => insert(index, {dynamic: false, urlExpr: ''})}>+</button>*/}
												<LabeledField label="Dynamic" name={`node.crawl[${index}].dynamic`} type="checkbox"/>
												<LabeledField label="Url extraction expression" name={`node.crawl[${index}].urlExpr`}/>
												<RemoveButton index={index} remove={remove}/>
												{index ? <MoveUpButton index={index} swap={swap}/> : null}
												{index < node.crawl.length-1 ? <MoveDownButton index={index} swap={swap}/> : null}
												<InsertButton index={index} insert={insert} value={{dynamic: false, urlExpr: ''}}/>
											</Fieldset>
										))}
									</div>
								)}
							/>)
						: <SetFieldValueButton field='node.crawl' value={[{dynamic: false, urlExpr: ''}]} setFieldValue={setFieldValue} text="Add crawl expression(s)"/>
					}

					<SubmitButton text="Save collection"/>
				</Form>);
			}}
		/>
	</div>
); // Collection
