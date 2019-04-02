import {connect, getIn} from 'formik';

import {Select} from '../elements/Select';

import {Header} from '../semantic-ui/Header';


import {Fulltext} from './Fulltext';
import {QueryGroup} from './QueryGroup';
import {CompareExpression} from './CompareExpression';
import {PathMatch} from './PathMatch';
import {Range} from './Range';

import {toStr} from '../utils/toStr';


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
			operator: 'or',
			searchString: {
				allowLetters: true,
				allowUnicodeLetters: true,
				allowDigits: true,
				allowUnderscore: true,
				allowSingleQuotes: true,
				allowAnd: true,
				allowOr: false,
				allowNegate: true,
				allowPrefix: false,
				allowPrecedence: false,
				allowPhrase: true,
				allowTilde: false
			}
		}
	}
}) => {
	console.debug(toStr({
		component: 'ExpressionSelector',
		//parentPath,
		//name,
		path,
		value
	}));
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
								operator: 'or',
								searchString: {
									allowLetters: true,
									allowUnicodeLetters: true,
									allowDigits: true,
									allowUnderscore: true,
									allowSingleQuotes: true,
									allowAnd: true,
									allowOr: false,
									allowNegate: true,
									allowPrefix: false,
									allowPrecedence: false,
									allowPhrase: true,
									allowTilde: false
								}
							}
						}],
						operator: 'or'
					}
					: {
						fields: [{
							field: '',
							boost: ''
						}],
						operator: 'or',
						searchString: {
							allowLetters: true,
							allowUnicodeLetters: true,
							allowDigits: true,
							allowUnderscore: true,
							allowSingleQuotes: true,
							allowAnd: true,
							allowOr: false,
							allowNegate: true,
							allowPrefix: false,
							allowPrecedence: false,
							allowPhrase: true,
							allowTilde: false
						}
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


/*
(
	fulltext(fields^1, searchString, 'AND')
	OR ngram(fields^0, searchString, 'AND')
	OR fulltext(fields^-1, synonyms, 'AND')
)

const EXAMPLE_QUERY = {
	type: 'group',
	params: {
		operator: 'or',
		expressions: [
			{
				type: 'fulltext',
				params: {
					operator: 'and',
					//searchString: '',
					fields: [
						{
							field: 'title',
							boost: '1'
						},
					]
				}
			},
			{
				type: 'ngram',
				params: {
					operator: 'and',
					//searchString: '',
					fields: [
						{
							field: 'title',
							boost: ''
						}
					]
				}
			},
			{
				type: 'fulltext',
				params: {
					operator: 'or',
					//searchString: '...synonyms',
					fields: [
						{
							field: 'title',
							boost: '-1'
						},
					]
				}
			}
		]
	}
};
*/
