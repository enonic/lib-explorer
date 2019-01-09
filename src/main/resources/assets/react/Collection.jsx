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
import {LabeledField} from './elements/LabeledField';
import {Table} from './elements/Table';

// Fields
import {NameField} from './fields/NameField';
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
					<NameField/>

					<Fieldset legend="Request">
						<UrlsField urls={urls}/>

						{pathRange
							? (<Fieldset legend="Path range">
								<LabeledField label="Min" name="pathRange.min"/>
								<Label label="Max">
									<Field name="pathRange.max"/>
								</Label>
								<SetFieldValueButton field='pathRange' value={null} setFieldValue={setFieldValue} text="Remove path range"/>
							</Fieldset>)
							: <SetFieldValueButton field='pathRange' value={{min: 0, max: 1}} setFieldValue={setFieldValue} text="Add path range"/>
						}

						{queryRange
							? (<Fieldset legend="Query range">
								<LabeledField label="Name" name="queryRange.name"/>
								<LabeledField label="Min" name="queryRange.min" type="number"/>
								<LabeledField label="Max" name="queryRange.max" type="number"/>
								<SetFieldValueButton field='queryRange' value={null} setFieldValue={setFieldValue} text="Remove query range"/>
							</Fieldset>)
							: <SetFieldValueButton field='queryRange' value={{name: '', min: 0, max: 1}} setFieldValue={setFieldValue} text="Add query range"/>
						}

						{headers && headers.length
							? (<Fieldset legend="Headers">
								<FieldArray
									name="headers"
									render={({insert, swap, remove}) => (
										<Table headers={['Name', 'Value', 'Action(s)']}>
											{headers && headers.length > 0 && headers.map(({name, value}, index) => {
												console.log(JSON.stringify({
													index,
													name,
													value
												}, null, 4));
												return (<tr key={`headers[${index}]`}>
													{/*<button type="button" onClick={() => insert(index, {name: '', value: ''})}>+</button>*/}
													<td><Field name={`headers[${index}].name`}/></td>
													<td><Field name={`headers[${index}].value`}/></td>
													<td>
														<RemoveButton index={index} remove={remove}/>
														{index ? <MoveUpButton index={index} swap={swap}/> : null}
														{index < headers.length-1 ? <MoveDownButton index={index} swap={swap}/> : null}
														<InsertButton index={index} insert={insert} value={{name: '', value: ''}}/>
													</td>
												</tr>);
											})}
										</Table>
									)}
								/>
							</Fieldset>)
							: <SetFieldValueButton field='headers' value={[{name: '', value: ''}]} setFieldValue={setFieldValue} text="Add header(s)"/>
						}

						<LabeledField label="Delay" name="delay"/>

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
