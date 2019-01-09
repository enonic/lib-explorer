/* global React */
import { Field, FieldArray, Form, Formik } from 'formik';
import PropTypes from 'prop-types';

//import {Node} from './Node';
// ERROR The next line cause runtime errors!
//import React, { Component } from 'react';

const Fieldset = ({children, legend, ...rest}) =>
	<fieldset {...rest}><legend>{legend}</legend>{children}</fieldset>;


const Label = ({children, label}) =>
	<label><span>{label}</span>{children}</label>;


const LabeledField = ({children, label, ...rest}) =>
	<Label label={label}><Field {...rest}/></Label>;


const SubmitButton = ({text}) => <button type="submit">{text}</button>;


const Table = ({children, headers}) =>
	<table><thead><tr>{headers.map(h => <th>{h}</th>)}</tr></thead><tbody>{children}</tbody></table>;


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
				console.log(values);
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
				const SetFieldValueButton = ({children, field, value, onClick, text}) => <button type="button" onClick={() => setFieldValue(field, value)}>{children||text}</button>;
				const RemoveButton = ({index, remove}) => <button type="button" onClick={() => remove(index)}>⌫</button>;
				const MoveUpButton = ({index, swap}) => <button type="button" onClick={() => swap(index, index-1)}>↑</button>;
				const MoveDownButton = ({index, swap}) => <button type="button" onClick={() => swap(index, index+1)}>↓</button>;
				const InsertButton = ({index, insert, value}) => <button type="button" onClick={() => insert(index+1, value)}>+</button>;

				return (<Form>
					<LabeledField label='Name' name="name" />

					<Fieldset legend="Request">
						<Fieldset legend="Url">
							<FieldArray
								name="urls"
								render={({insert, swap, remove}) => (
									<div>
										{urls && urls.map((anUrl, index) => {
											/*console.log(JSON.stringify({
												anUrl,
												index
											}, null, 4));*/
											return (<div key={`urls[${index}]`}>
												{/*<button type="button" onClick={() => insert(index, '')}>⎀</button>*/}
												<Field name={`urls[${index}]`} />
												{urls.length > 1 ? <RemoveButton index={index} remove={remove}/> : null}
												{index ? <MoveUpButton index={index} swap={swap}/> : null}
												{index < urls.length-1 ? <MoveDownButton index={index} swap={swap}/> : null}
												<InsertButton index={index} insert={insert} value={''}/>
											</div>);
										})}
									</div>
								)}
							/>
						</Fieldset>

						{pathRange
							? (<Fieldset legend="Path range">
								<LabeledField label="Min" name="pathRange.min"/>
								<Label label="Max">
									<Field name="pathRange.max"/>
								</Label>
								<SetFieldValueButton field='pathRange' value={null} text="Remove path range"/>
							</Fieldset>)
							: <SetFieldValueButton field='pathRange' value={{min: 0, max: 1}} text="Add path range"/>
						}

						{queryRange
							? (<Fieldset legend="Query range">
								<LabeledField label="Name" name="queryRange.name"/>
								<LabeledField label="Min" name="queryRange.min" type="number"/>
								<LabeledField label="Max" name="queryRange.max" type="number"/>
								<SetFieldValueButton field='queryRange' value={null} text="Remove query range"/>
							</Fieldset>)
							: <SetFieldValueButton field='queryRange' value={{name: '', min: 0, max: 1}} text="Add query range"/>
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
							: <SetFieldValueButton field='headers' value={[{name: '', value: ''}]} text="Add header(s)"/>
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
						: <SetFieldValueButton field='node.scrape' value={[{field: '', dataExpr: ''}]} text="Add scrape field"/>
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
						: <SetFieldValueButton field='node.download' value={['']} text="Add download expression(s)"/>
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
						: <SetFieldValueButton field='node.crawl' value={[{dynamic: false, urlExpr: ''}]} text="Add crawl expression(s)"/>
					}

					<SubmitButton text="Save collection"/>
				</Form>);
			}}
		/>
	</div>
); // Collection
