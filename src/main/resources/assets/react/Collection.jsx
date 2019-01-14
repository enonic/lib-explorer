/* global React */
import {Form, Formik} from 'formik';

// ERROR The next line cause runtime errors!
//import React, { Component } from 'react';

import {SubmitButton} from './buttons/SubmitButton';
import {NameField} from './fields/NameField';
import {Surgeon} from './fields/Surgeon';


export const Collection = ({
	fields = [],
	initialValues = {
		collector: {
			config: { // Avoid uncontrolled to controlled warning:
				delay: 1000,
				urls: [''] // At least one is required
			},
			name: 'surgeon'
		},
		name: ''
	}
} = {}) => <Formik
	initialValues={initialValues}
	onSubmit={values => {
		console.log(JSON.stringify(values, null, 4));
	}}
	render={({
		handleBlur,
		handleChange,
		setFieldValue,
		setValues,
		values
	}) => /*{
		console.log(JSON.stringify({fields, values}, null, 4));
		return */<Form>
	<NameField/>
	<Surgeon
		fields={fields}
		handleBlur={handleBlur}
		handleChange={handleChange}
		path='collector.config'
		setFieldValue={setFieldValue}
		values={values}
	/>
	<SubmitButton text="Save collection"/>
</Form>/*}*/}
/>; // Collection
