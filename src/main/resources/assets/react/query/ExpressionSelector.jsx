import {connect, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';

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
	value = values && getIn(values, path)
}) => {
	/*console.debug(toStr({
		component: 'ExpressionSelector',
		//parentPath,
		//name,
		path,
		value
	}));*/
	const {params = {}, type = ''} = value;
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
				//console.debug(toStr({selectPath, paramsPath}));
				const htmlCollectionAsArray = [].slice
					.call(selectedOptions)
					.map(({value}) => value);
				//console.debug(toStr({htmlCollectionAsArray}));
				const newType = htmlCollectionAsArray[0];
				//console.debug(toStr({newType}));
				setFieldValue(selectPath, newType);
				if(newType === 'group') {
					setFieldValue(paramsPath, {
						expressions: [],
						operator: 'or'
					});
				} else if (['fulltext', 'ngram'].includes(newType)) {
					setFieldValue(paramsPath, {
						fields: [{
							field: '_allText',
							boost: '',
							uuid4: generateUuidv4()
						}],
						operator: 'and'
					});
				} else if (newType === 'compareExpr') {
					setFieldValue(paramsPath, {
						field: '',
						operator: '=',
						valueExpr: ''
					});
				} else if (newType === 'range') {
					setFieldValue(paramsPath, {
						field: '',
						from : '',
						to: '',
						includeFrom: false,
						includeTo: false
					});
				} else if (newType === 'pathMatch') {
					setFieldValue(paramsPath, {
						field: '',
						path: '',
						minMatch: 1
					});
				}
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
			placeholder='Please select expression type'
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
				fields={fields}
				path={paramsPath}
			/>
			: null
		}
		{type === 'range'
			? <Range
				fields={fields}
				path={paramsPath}
			/>
			: null
		}
		{type === 'pathMatch'
			? <PathMatch
				fields={fields}
				path={paramsPath}
			/>
			: null
		}
	</>;
});
