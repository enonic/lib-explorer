import {connect, getIn} from 'formik';

import {Select} from '../elements/Select';

import {Header} from '../semantic-ui/Header';


import {Fulltext} from './Fulltext';
import {QueryGroup} from './QueryGroup';
import {CompareExpression} from './CompareExpression';
import {PathMatch} from './PathMatch';
import {Range} from './Range';

//import {toStr} from '../utils/toStr';


export const ExpressionSelector = connect(({
	formik: {
		setFieldValue,
		values
	},
	fields,
	name = 'query',
	legend = null,
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	value = values && getIn(values, path) || {
		type: 'fulltext',
		params: {
			fields: [{
				field: '',
				boost: ''
			}],
			operator: 'or'
		}
	}
}) => {
	const {params, type} = value;
	const selectPath = `${path}.type`;
	const paramsPath = `${path}.params`;
	return <>
		<Header dividing>{legend}</Header>
		<Select
			path={selectPath}
			onChange={({
				target: {
					selectedOptions // HTMLCollection
				}
			}) => {
				const htmlCollectionAsArray = [].slice
					.call(selectedOptions)
					.map(({value}) => value);
				const newType = htmlCollectionAsArray[0];
				//console.debug({ selectPath, htmlCollectionAsArray});
				setFieldValue(selectPath, newType);
				setFieldValue(paramsPath, newType === 'group'
					? {
						expressions: [{
							type: 'fulltext',
							params: {
								fields: [{
									field: '',
									boost: ''
								}],
								operator: 'or'
							}
						}],
						operator: 'or'
					}
					: {
						fields: [{
							field: '',
							boost: ''
						}],
						operator: 'or'
					}
				);
			}}
			options={[{
				label: 'Logic',
				value: 'group'
			}, {
				label: 'Fulltext',
				value: 'fulltext'
			}, {
				label: 'Ngram',
				value: 'ngram'
			}, {
				label: 'Compare expression',
				value: 'compareExpr'
			}, {
				label: 'Range',
				value: 'range'
			}, {
				label: 'Path match',
				value: 'pathMatch'
			}]}
			value={type}
		/>
		{['fulltext', 'ngram'].includes(type)
			? <Fulltext
				fields={fields}
				path={paramsPath}
			/>
			: null
		}
		{type === 'group'
			? <QueryGroup
				fields={fields}
				path={paramsPath}
			/>
			: null
		}
		{type === 'compareExpr'
			? <CompareExpression
				path={paramsPath}
				fields={fields}
			/>
			: null
		}
		{type === 'range'
			? <Range
				path={paramsPath}
				fields={fields}
			/>
			: null
		}
		{type === 'pathMatch'
			? <PathMatch
				path={paramsPath}
				fields={fields}
			/>
			: null
		}
	</>;
});
