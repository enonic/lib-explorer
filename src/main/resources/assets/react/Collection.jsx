/* global React */
import { Field, FieldArray, Form, Formik } from 'formik';
import PropTypes from 'prop-types';

//import {Node} from './Node';
// ERROR The next line cause runtime errors!
//import React, { Component } from 'react';

export const Collection = props => (
	<div>
		<Formik
			initialValues={props}
			onSubmit={values => {
				console.log(values);
			}}
			render={({
				values: {
					delay,
					headers,
					name,
					pathRange,
					queryRange,
					urls
				}
			}) => (
				<Form>
					<fieldset>
						<legend>Collection</legend>
						<label>
							<span>Name</span>
							<Field name="name" />
						</label>
						<fieldset>
							<legend>Url</legend>
							<FieldArray
								name="urls"
								render={({insert, push, swap, remove}) => (
									<div>
										{urls && urls.length > 0 && urls.map((anUrl, index) => (
											<div key={index}>
												{/*<button type="button" onClick={() => insert(index, '')}>⎀</button>*/}
												<Field name={`urls[${index}]`} />
												<button type="button" onClick={() => remove(index)}>⌫</button>
												{index ? <button type="button" onClick={() => swap(index, index-1)}>↑</button> : null}
												{index < urls.length-1 ? <button type="button" onClick={() => swap(index, index+1)}>↓</button> : null}
											</div>
										))}
										<button type="button" onClick={() => push('')}>Add url</button>
									</div>
								)}
							/>
						</fieldset>
						<fieldset>
							<legend>Path range</legend>
							<label>
								<span>Min</span>
								<Field name="pathRange.min"/>
							</label>
							<label>
								<span>Max</span>
								<Field name="pathRange.max"/>
							</label>
						</fieldset>
						<fieldset>
							<legend>Query range</legend>
							<label>
								<span>Name</span>
								<Field name="queryRange.name"/>
							</label>
							<label>
								<span>Min</span>
								<Field name="queryRange.min"/>
							</label>
							<label>
								<span>Max</span>
								<Field name="queryRange.max"/>
							</label>
						</fieldset>
						<fieldset>
							<legend>Headers</legend>
							<FieldArray
								name="headers"
								render={({/*insert, */push, swap, remove}) => (
									<div>
										{headers && headers.length > 0 && headers.map(({name, value}, index) => (
											<div key={index}>
												{/*<button type="button" onClick={() => insert(index, {name: '', value: ''})}>+</button>*/}
												<Field name={`headers[${index}].name`} />
												<Field name={`headers[${index}].value`} />
												<button type="button" onClick={() => remove(index)}>⌫</button>
												{index ? <button type="button" onClick={() => swap(index, index-1)}>↑</button> : null}
												{index < headers.length-1 ? <button type="button" onClick={() => swap(index, index+1)}>↓</button> : null}
											</div>
										))}
										<button type="button" onClick={() => push({name: '', value: ''})}>Add header</button>
									</div>
								)}
							/>
						</fieldset>
						<label>
							<span>Delay</span>
							<Field name="delay"/>
						</label>
						<button type="submit">Save collection</button>
					</fieldset>
				</Form>
			)}
		/>
	</div>
); // Collection
